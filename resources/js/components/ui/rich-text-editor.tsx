import MDEditor from '@uiw/react-md-editor';
import { cn } from '@/lib/utils';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface RichTextEditorProps {
    value?: string;
    onChange?: (value?: string) => void;
    placeholder?: string;
    error?: string;
    height?: number;
    preview?: 'edit' | 'preview' | 'live';
    className?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Start typing...",
    error,
    height = 200,
    preview = 'live',
    className
}: RichTextEditorProps) {
    return (
        <div className="space-y-1">
            <div className={cn(
                "border rounded-md overflow-hidden",
                error && "border-red-500",
                className
            )}>
                <MDEditor
                    value={value}
                    onChange={onChange}
                    data-color-mode="light"
                    height={height}
                    preview={preview}
                    textareaProps={{
                        placeholder,
                        className: "!text-base",
                    }}
                    className="!border-0"
                />
            </div>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

export default RichTextEditor;
