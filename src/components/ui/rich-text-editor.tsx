import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import History from '@tiptap/extension-history';
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon, 
  Code as CodeIcon, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Code,
      CodeBlock,
      Heading.configure({
        levels: [1, 2],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      History,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    children,
    title = ''
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-emerald-600 text-white' 
          : 'hover:bg-gray-700 text-gray-300 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-700 bg-gray-800">
         
        {/* Undo/Redo */}
        <MenuButton 
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-6 bg-gray-700 mx-1"></div>
        
        {/* Text Formatting */}
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <BoldIcon className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <ItalicIcon className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-6 bg-gray-700 mx-1"></div>
        
        {/* Headings */}
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-6 bg-gray-700 mx-1"></div>
        
        {/* Lists */}
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-6 bg-gray-700 mx-1"></div>
        
        {/* Code and Highlight */}
        <MenuButton 
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Code"
        >
          <CodeIcon className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </MenuButton>
        
        <div className="w-px h-6 bg-gray-700 mx-1"></div>
        
        {/* Text Alignment */}
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </MenuButton>
        
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </MenuButton>
        
       
      </div>
      
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[200px] focus:outline-none prose prose-invert prose-sm max-w-none"
      />
    </div>
  );
};

export  { RichTextEditor }