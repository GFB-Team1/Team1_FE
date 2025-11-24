export default function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm border 
          ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white'}
        `}
      >
        Bold
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm border 
          ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white'}
        `}
      >
        Italic
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded text-sm border 
          ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white'}
        `}
      >
        • List
      </button>
    </div>
  );
}