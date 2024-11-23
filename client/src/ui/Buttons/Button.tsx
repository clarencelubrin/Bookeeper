type ButtonProps = {
  buttonType: string;
  onClick: () => void;
  children: React.ReactNode;
}
function Button({buttonType, onClick, children}: ButtonProps) {
  return (
    <button className={`button button-${buttonType}`} onClick={onClick}>
        {children}
    </button>
  )
}

export default Button