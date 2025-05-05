import 'react-quill-new/dist/quill.snow.css';
import dynamic from "next/dynamic";
import ReactQuill from 'react-quill-new';
const DynamicQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function QuillEditor(props: ReactQuill.ReactQuillProps) {
  return (
    <DynamicQuill {...props} />
  )
}
