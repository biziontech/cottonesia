import { useCallback, useEffect, useState, useRef, useMemo } from 'react';

import { RichTextProvider } from 'reactjs-tiptap-editor';

// Base Kit
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { ListItem } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  Dropcursor,
  Gapcursor,
  Placeholder,
  TrailingNode,
} from '@tiptap/extensions';

// build extensions
import {
  Attachment,
  RichTextAttachment,
} from 'reactjs-tiptap-editor/attachment';
import {
  Blockquote,
  RichTextBlockquote,
} from 'reactjs-tiptap-editor/blockquote';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import {
  BulletList,
  RichTextBulletList,
} from 'reactjs-tiptap-editor/bulletlist';
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear';
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code';
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview';
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import {
  Column,
  ColumnNode,
  MultipleColumnNode,
  RichTextColumn,
} from 'reactjs-tiptap-editor/column';
import { Drawer, RichTextDrawer } from 'reactjs-tiptap-editor/drawer';
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji';
import {
  Excalidraw,
  RichTextExcalidraw,
} from 'reactjs-tiptap-editor/excalidraw';
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import {
  ExportWord,
  RichTextExportWord,
} from 'reactjs-tiptap-editor/exportword';
import {
  FontFamily,
  RichTextFontFamily,
} from 'reactjs-tiptap-editor/fontfamily';
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight';
import {
  History,
  RichTextRedo,
  RichTextUndo,
} from 'reactjs-tiptap-editor/history';
import {
  HorizontalRule,
  RichTextHorizontalRule,
} from 'reactjs-tiptap-editor/horizontalrule';
import { Iframe, RichTextIframe } from 'reactjs-tiptap-editor/iframe';
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image';
import { ImageGif, RichTextImageGif } from 'reactjs-tiptap-editor/imagegif';
import {
  ImportWord,
  RichTextImportWord,
} from 'reactjs-tiptap-editor/importword';
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { Katex, RichTextKatex } from 'reactjs-tiptap-editor/katex';
import {
  LineHeight,
  RichTextLineHeight,
} from 'reactjs-tiptap-editor/lineheight';
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
import { Mermaid, RichTextMermaid } from 'reactjs-tiptap-editor/mermaid';
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark';
import {
  OrderedList,
  RichTextOrderedList,
} from 'reactjs-tiptap-editor/orderedlist';
import {
  RichTextSearchAndReplace,
  SearchAndReplace,
} from 'reactjs-tiptap-editor/searchandreplace';
import { RichTextStrike, Strike } from 'reactjs-tiptap-editor/strike';
import { RichTextTable, Table } from 'reactjs-tiptap-editor/table';
import { RichTextTaskList, TaskList } from 'reactjs-tiptap-editor/tasklist';
import { RichTextAlign, TextAlign } from 'reactjs-tiptap-editor/textalign';
import {
  RichTextTextDirection,
  TextDirection,
} from 'reactjs-tiptap-editor/textdirection';
import {
  RichTextUnderline,
  TextUnderline,
} from 'reactjs-tiptap-editor/textunderline';
import { RichTextTwitter, Twitter } from 'reactjs-tiptap-editor/twitter';
import { RichTextVideo, Video } from 'reactjs-tiptap-editor/video';
import { RichTextCallout, Callout } from 'reactjs-tiptap-editor/callout';

// Slash Command
import {
  SlashCommand,
  SlashCommandList,
} from 'reactjs-tiptap-editor/slashcommand';

// Bubble
import {
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleImage,
  RichTextBubbleImageGif,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,
  RichTextBubbleVideo,
  RichTextBubbleMenuDragHandle,
  RichTextBubbleCallout,
} from 'reactjs-tiptap-editor/bubble';

import '@excalidraw/excalidraw/index.css';
import 'easydrawer/styles.css';
import 'katex/dist/katex.min.css';
import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';
import 'reactjs-tiptap-editor/style.css';

import { Header, NavBar } from '@/components/editor/Header';
import { EditorContent, useEditor } from '@tiptap/react';
import 'katex/contrib/mhchem';
import { CharacterCount } from '@tiptap/extensions';
import { Count } from '@/components/editor/extension/Count';
import { EMOJI_LIST } from '@/components/editor/emojis';

function convertBase64ToBlob(base64) {
  const arr = base64.split(',');
  const match = arr[0].match(/:(.*?);/);
  const mime = match ? match[1] : '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// custom document to support columns
const DocumentColumn = /* @__PURE__ */ Document.extend({
  content: '(block|columns)+',
});

const BaseKit = [
  DocumentColumn,
  Text,
  Dropcursor.configure({
    class: 'reactjs-tiptap-editor-theme',
    color: 'hsl(var(--primary))',
    width: 2,
  }),
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: "Press '/' for commands",
  }),
];

const LIMIT = 2505;

const extensions = [
  ...BaseKit,
  CharacterCount.configure({
    limit: LIMIT,
  }),

  History,
  SearchAndReplace,
  Clear,
  FontFamily,
  Heading,
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji.configure({
    suggestion: {
      items: async ({ query }) => {
        const lowerCaseQuery = query?.toLowerCase();

        return EMOJI_LIST.filter(({ name }) =>
          name.toLowerCase().includes(lowerCaseQuery),
        );
      },
    },
  }),
  Color,
  Highlight,
  BulletList,
  OrderedList,
  TextAlign,
  Indent,
  LineHeight,
  TaskList,
  Link,
  Image.configure({
    upload: (files) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 300);
      });
    },
  }),
  Video.configure({
    upload: (files) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files));
        }, 300);
      });
    },
  }),
  ImageGif.configure({
    provider: 'giphy',
    API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY,
  }),
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock,

  Column,
  ColumnNode,
  MultipleColumnNode,
  Table,
  Iframe,
  ExportPdf,
  ImportWord,
  ExportWord,
  TextDirection,
  Attachment.configure({
    upload: (file) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  Katex,
  Excalidraw,
  Mermaid.configure({
    upload: (file) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  Drawer.configure({
    upload: (file) => {
      // fake upload return base 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result);
          resolve(URL.createObjectURL(blob));
        }, 300);
      });
    },
  }),
  SlashCommand,
  CodeView,
  Callout,
];

const DEFAULT = ``;

const RichTextToolbar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'format', label: 'Format' },
    { id: 'table', label: 'Table' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {/* Clipboard Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextUndo />
              <RichTextRedo />
            </div>

            {/* Font Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300 flex-wrap">
              <RichTextFontFamily />
              <RichTextFontSize />
              <RichTextHeading />
            </div>

            {/* Text Style Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextBold />
              <RichTextItalic />
              <RichTextUnderline />
              <RichTextStrike />
              <RichTextMoreMark />
            </div>

            {/* Color Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextColor />
              <RichTextHighlight />
            </div>

            {/* Paragraph Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextBulletList />
              <RichTextOrderedList />
              <RichTextTaskList />
              <RichTextIndent />
            </div>

            {/* Alignment Group */}
            <div className="flex items-center gap-1 px-2">
              <RichTextAlign />
              <RichTextLineHeight />
              <RichTextTextDirection />
            </div>
          </div>
        );

      case 'insert':
        return (
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {/* Media Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextImage />
              <RichTextVideo />
              <RichTextImageGif />
            </div>

            {/* Elements Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextLink />
              <RichTextEmoji />
              <RichTextBlockquote />
              <RichTextHorizontalRule />
            </div>

            {/* Advanced Insert */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextIframe />
              <RichTextMermaid />
              <RichTextKatex />
              <RichTextExcalidraw />
              <RichTextDrawer />
            </div>

            {/* Attachments */}
            <div className="flex items-center gap-1 px-2">
              <RichTextAttachment />
            </div>
          </div>
        );

      case 'format':
        return (
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {/* Code Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextCode />
              <RichTextCodeBlock />
              <RichTextCodeView />
            </div>

            {/* Layout Group */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-300">
              <RichTextColumn />
              <RichTextCallout />
            </div>

            {/* Tools */}
            <div className="flex items-center gap-1 px-2">
              <RichTextSearchAndReplace />
              <RichTextClear />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <div className="flex items-center gap-1 px-2">
              <RichTextTable />
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {/* Import/Export Group */}
            <div className="flex items-center gap-1 px-2 border-r border-white-300">
              <RichTextImportWord />
              <RichTextExportWord />
              <RichTextExportPdf />
            </div>

            {/* Special Features */}
            {/* <div className="flex items-center gap-1 px-2">
              <RichTextTwitter />
            </div> */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="!border-b !border-solid !border-gray-300">
      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 px-2 pt-1 bg-white !border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-3 sm:px-4 py-1.5 sm:py-2 !text-xs !font-medium rounded-t transition-colors whitespace-nowrap
              ${activeTab === tab.id
                ? 'bg-white !text-primary-600 !border-b-2 !border-primary-600'
                : '!text-gray-600 !hover:text-gray-900 !hover:bg-gray-100'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-1 sm:p-2 bg-white">
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

function App({ onBlur, initialContent = DEFAULT }) {
  const [content, setContent] = useState(initialContent);
  const debounceTimer = useRef(null);

  const memoizedExtensions = useMemo(() => extensions, []);

  const editor = useEditor({
    textDirection: 'auto',
    content,
    extensions: memoizedExtensions,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Debounce di sini lebih baik
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const html = editor.getHTML();
        if (onBlur) {
          onBlur(html);
        }
      }, 1000); // Naikkan jadi 1 detik
    },
  });

  useEffect(() => {
    window['editor'] = editor;
  }, [editor]);

  return (
    <>
      <div className=" w-full max-w-[1200px] mx-[auto] my-0">
        <RichTextProvider editor={editor}>
          <div className="overflow-hidden rounded-xl bg-background shadow-sm">
            <div className="flex max-h-full w-full flex-col">
              <RichTextToolbar />

              <EditorContent editor={editor} className='min-h-[500px]' />

              {/* Bubble - Lazy Rendered */}
              {editor?.isActive('columns') && <RichTextBubbleColumns />}
              {editor?.isActive('drawer') && <RichTextBubbleDrawer />}
              {editor?.isActive('excalidraw') && <RichTextBubbleExcalidraw />}
              {editor?.isActive('iframe') && <RichTextBubbleIframe />}
              {editor?.isActive('katex') && <RichTextBubbleKatex />}
              {editor?.isActive('link') && <RichTextBubbleLink />}

              {editor?.isActive('image') && <RichTextBubbleImage />}
              {editor?.isActive('video') && <RichTextBubbleVideo />}
              {editor?.isActive('imageGif') && <RichTextBubbleImageGif />}

              {editor?.isActive('mermaid') && <RichTextBubbleMermaid />}
              {editor?.isActive('table') && <RichTextBubbleTable />}
              {editor?.isActive('callout') && <RichTextBubbleCallout />}
              {editor?.isActive('twitter') && <RichTextBubbleTwitter />}

              {/* Bubble Text selalu render karena sering dipakai */}
              <RichTextBubbleText />

              {/* Command List - tetap render */}
              <SlashCommandList />
              <RichTextBubbleMenuDragHandle />
            </div>

            <Count editor={editor} limit={LIMIT} />
          </div>
        </RichTextProvider>
      </div>
    </>
  );
}

export default App;
