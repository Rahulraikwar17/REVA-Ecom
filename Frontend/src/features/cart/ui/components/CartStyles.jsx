const css = `
@keyframes cart-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes cart-pop {
  0% { opacity: 0; transform: scale(0.7); }
  60% { transform: scale(1.12); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes cart-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.cart-rise { animation: cart-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
.cart-pop { animation: cart-pop 0.3s ease-out; }
.cart-shake { animation: cart-shake 0.4s ease; }

@media (prefers-reduced-motion: reduce) {
  .cart-rise, .cart-pop, .cart-shake { animation: none; }
}
`;

const CartStyles = () => <style>{css}</style>;

export default CartStyles;