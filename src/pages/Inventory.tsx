import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Package, AlertTriangle, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSubscriptionLimits } from '@/hooks/use-subscription-limits';
import { UpgradePrompt } from '@/components/ui/upgrade-prompt';

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  unit_price: number;
  current_stock: number;
  min_stock: number;
  is_active: boolean;
  created_at: string;
}

interface StockMovement {
  id: string;
  product_name: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference_type?: string;
  notes?: string;
  created_at: string;
}

export function Inventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canAccessFeature, limits } = useSubscriptionLimits();
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    unit_price: 0,
    current_stock: 0,
    min_stock: 0,
    is_active: true
  });

  const [movementForm, setMovementForm] = useState({
    product_id: '',
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reference_type: 'adjustment',
    notes: ''
  });

  const categories = ['Produtos de Limpeza', 'Cosméticos', 'Equipamentos', 'Materiais', 'Outros'];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (productsError) throw productsError;

      // Fetch stock movements with product data
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products:product_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (movementsError) throw movementsError;

      setProducts(productsData || []);
      setMovements(movementsData?.map(m => ({
        id: m.id,
        product_name: m.products?.name || 'N/A',
        type: m.type as 'in' | 'out' | 'adjustment',
        quantity: m.quantity,
        reference_type: m.reference_type,
        notes: m.notes,
        created_at: m.created_at
      })) || []);

    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do estoque",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productForm)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{ ...productForm, user_id: user?.id }]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso!",
        });
      }

      setProductDialogOpen(false);
      resetProductForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar produto",
        variant: "destructive",
      });
    }
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Insert stock movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert([movementForm]);

      if (movementError) throw movementError;

      // Update product stock
      const product = products.find(p => p.id === movementForm.product_id);
      if (product) {
        let newStock = product.current_stock;
        
        if (movementForm.type === 'in') {
          newStock += movementForm.quantity;
        } else if (movementForm.type === 'out') {
          newStock -= movementForm.quantity;
        } else { // adjustment
          newStock = movementForm.quantity;
        }

        const { error: updateError } = await supabase
          .from('products')
          .update({ current_stock: Math.max(0, newStock) })
          .eq('id', movementForm.product_id);

        if (updateError) throw updateError;
      }
      
      toast({
        title: "Sucesso",
        description: "Movimentação registrada com sucesso!",
      });

      setMovementDialogOpen(false);
      resetMovementForm();
      fetchData();
    } catch (error) {
      console.error('Error saving stock movement:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar movimentação",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso!",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover produto",
        variant: "destructive",
      });
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      sku: '',
      category: '',
      unit_price: 0,
      current_stock: 0,
      min_stock: 0,
      is_active: true
    });
    setEditingProduct(null);
  };

  const resetMovementForm = () => {
    setMovementForm({
      product_id: '',
      type: 'in',
      quantity: 0,
      reference_type: 'adjustment',
      notes: ''
    });
  };

  const openEditDialog = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description || '',
      sku: product.sku || '',
      category: product.category || '',
      unit_price: product.unit_price,
      current_stock: product.current_stock,
      min_stock: product.min_stock,
      is_active: product.is_active
    });
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'out': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Package className="h-4 w-4 text-primary" />;
    }
  };

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'in': return 'Entrada';
      case 'out': return 'Saída';
      default: return 'Ajuste';
    }
  };

  const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock).length;
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.current_stock * p.unit_price), 0);
  const activeProducts = products.filter(p => p.is_active).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!canAccessFeature('can_use_inventory')) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <UpgradePrompt
              feature="Controle de Estoque"
              currentPlan={limits.plan_type}
              requiredPlan="pro"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Controle de Estoque</h1>
            <p className="text-muted-foreground">Gerencie produtos e movimentações do estoque</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/20">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Produtos Ativos</p>
                <p className="text-2xl font-bold">{activeProducts}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/20">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                <p className="text-2xl font-bold">{lowStockProducts}</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-neon-purple/20">
                <Package className="h-6 w-6 text-neon-purple" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="glass-card border-0">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="movements">Movimentações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetProductForm()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-0 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product_name">Nome *</Label>
                        <Input
                          id="product_name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          className="glass-input"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="product_sku">SKU</Label>
                        <Input
                          id="product_sku"
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          className="glass-input"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="product_description">Descrição</Label>
                      <Textarea
                        id="product_description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="glass-input"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product_category">Categoria</Label>
                        <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="product_price">Preço Unitário *</Label>
                        <Input
                          id="product_price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.unit_price}
                          onChange={(e) => setProductForm({ ...productForm, unit_price: parseFloat(e.target.value) || 0 })}
                          required
                          className="glass-input"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product_stock">Estoque Atual *</Label>
                        <Input
                          id="product_stock"
                          type="number"
                          min="0"
                          value={productForm.current_stock}
                          onChange={(e) => setProductForm({ ...productForm, current_stock: parseInt(e.target.value) || 0 })}
                          required
                          className="glass-input"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="product_min_stock">Estoque Mínimo *</Label>
                        <Input
                          id="product_min_stock"
                          type="number"
                          min="0"
                          value={productForm.min_stock}
                          onChange={(e) => setProductForm({ ...productForm, min_stock: parseInt(e.target.value) || 0 })}
                          required
                          className="glass-input"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingProduct ? 'Atualizar' : 'Adicionar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {products.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando produtos para controlar seu estoque.
                </p>
                <Button onClick={() => setProductDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Primeiro Produto
                </Button>
              </GlassCard>
            ) : (
              products.map((product) => (
                <GlassCard key={product.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        {product.sku && (
                          <Badge variant="outline">SKU: {product.sku}</Badge>
                        )}
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {product.current_stock <= product.min_stock && (
                          <Badge variant="destructive">Estoque Baixo</Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        {product.description && <p>{product.description}</p>}
                        {product.category && <p>Categoria: {product.category}</p>}
                        <p>Preço: R$ {product.unit_price.toFixed(2)}</p>
                        <p>Estoque: {product.current_stock} (mín: {product.min_stock})</p>
                        <p>Valor total: R$ {(product.current_stock * product.unit_price).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="movements" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={movementDialogOpen} onOpenChange={setMovementDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetMovementForm()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Movimentação
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-0">
                  <DialogHeader>
                    <DialogTitle>Nova Movimentação</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleMovementSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="movement_product">Produto *</Label>
                      <Select value={movementForm.product_id} onValueChange={(value) => setMovementForm({ ...movementForm, product_id: value })}>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} (Estoque: {product.current_stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="movement_type">Tipo de Movimentação *</Label>
                      <Select value={movementForm.type} onValueChange={(value: any) => setMovementForm({ ...movementForm, type: value })}>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in">Entrada</SelectItem>
                          <SelectItem value="out">Saída</SelectItem>
                          <SelectItem value="adjustment">Ajuste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="movement_quantity">
                        {movementForm.type === 'adjustment' ? 'Quantidade Final' : 'Quantidade'} *
                      </Label>
                      <Input
                        id="movement_quantity"
                        type="number"
                        min="0"
                        value={movementForm.quantity}
                        onChange={(e) => setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) || 0 })}
                        required
                        className="glass-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="movement_notes">Observações</Label>
                      <Textarea
                        id="movement_notes"
                        value={movementForm.notes}
                        onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                        className="glass-input"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setMovementDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Registrar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {movements.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma movimentação registrada</h3>
                <p className="text-muted-foreground mb-4">
                  As movimentações de estoque aparecerão aqui.
                </p>
                <Button onClick={() => setMovementDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Primeira Movimentação
                </Button>
              </GlassCard>
            ) : (
              movements.map((movement) => (
                <GlassCard key={movement.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getMovementIcon(movement.type)}
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{movement.product_name}</h3>
                          <Badge variant="outline">
                            {getMovementLabel(movement.type)}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Data: {new Date(movement.created_at).toLocaleDateString('pt-BR')}</p>
                          {movement.reference_type && <p>Tipo: {movement.reference_type}</p>}
                          {movement.notes && <p>Obs: {movement.notes}</p>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        movement.type === 'in' ? 'text-success' : 
                        movement.type === 'out' ? 'text-destructive' : 'text-primary'
                      }`}>
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '='}
                        {movement.quantity}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}