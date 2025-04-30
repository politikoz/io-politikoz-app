interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => (
  <div className="text-center">
    <h3 className="text-lg font-semibold text-green-500">{message}</h3>
  </div>
);

export default SuccessMessage;