interface TextareaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({
  id,
  name,
  placeholder,
  value,
  className,
  onChange,
}: TextareaProps) {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      className={`border border-border rounded-lg bg-gray-100 placeholder-gray=500 resize-none ${className || ''}`}
      value={value}
      onChange={onChange}
    ></textarea>
  );
}
