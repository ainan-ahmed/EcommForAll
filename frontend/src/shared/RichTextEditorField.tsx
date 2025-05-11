import { RichTextEditor } from './RichTextEditor';

interface RichTextEditorFieldProps {
  form: any;
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  minHeight?: number | string;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditorField({
  form,
  name,
  ...props
}: RichTextEditorFieldProps) {
  const { value, onChange, error } = form.getInputProps(name);
  
  return (
    <RichTextEditor
      value={value || ''}
      onChange={(newValue) => form.setFieldValue(name, newValue)}
      error={error}
      {...props}
    />
  );
}