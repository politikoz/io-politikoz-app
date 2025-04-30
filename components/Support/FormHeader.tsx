interface FormHeaderProps {
  title: string;
  onClose: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, onClose }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold">{title}</h2>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
      ✕
    </button>
  </div>
);

export default FormHeader;