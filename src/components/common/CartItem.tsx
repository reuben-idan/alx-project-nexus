import { Minus, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';

export interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const CartItem = ({
  id,
  name,
  price,
  quantity,
  image,
  onRemove,
  onUpdateQuantity
}: CartItemProps) => {
  const handleIncrement = () => {
    onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="flex items-center py-4 gap-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={image || '/images/logo.png'}
          alt={name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/logo.png'; }}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex-1">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{name}</h4>
          <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-3 min-w-[3rem] text-center">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-4 text-sm font-medium text-gray-900">
        ${(price * quantity).toFixed(2)}
      </div>
      <div className="ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
