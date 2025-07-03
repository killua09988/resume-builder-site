'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: 'header' | 'experience' | 'education' | 'skills';
}

interface SortableSectionProps {
  section: ResumeSection;
  isPreview: boolean;
  onContentChange: (id: string, content: string) => void;
}

function SortableSection({ section, isPreview, onContentChange }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    onContentChange(section.id, e.currentTarget.textContent || '');
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'header': return '👤';
      case 'experience': return '💼';
      case 'education': return '🎓';
      case 'skills': return '🛠️';
      default: return '📄';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 ${
        section.type === 'header' ? 'border-blue-500' :
        section.type === 'experience' ? 'border-green-500' :
        section.type === 'education' ? 'border-purple-500' :
        'border-orange-500'
      } ${!isPreview ? 'hover:shadow-lg transition-shadow cursor-move' : ''}`}
      {...attributes}
      {...(!isPreview ? listeners : {})}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span>{getSectionIcon(section.type)}</span>
          {section.title}
        </h2>
        {!isPreview && (
          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-sm">Drag to reorder</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6L6 10l4 4 4-4-4-4z"/>
            </svg>
          </div>
        )}
      </div>
      <div
        contentEditable={!isPreview}
        suppressContentEditableWarning={true}
        onBlur={handleContentChange}
        className={`text-gray-700 leading-relaxed ${
          !isPreview ? 'min-h-[60px] p-2 border-2 border-dashed border-gray-200 rounded focus:border-blue-300 focus:outline-none' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </div>
  );
}

export default function Home() {
  const [isPreview, setIsPreview] = useState(false);
  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: 'header',
      title: 'Header',
      type: 'header',
      content: '<h1 class="text-2xl font-bold mb-2">John Doe</h1><p class="text-lg text-gray-600">Software Engineer</p><p class="text-sm text-gray-500">john.doe@email.com | (555) 123-4567 | LinkedIn: /in/johndoe</p>'
    },
    {
      id: 'experience',
      title: 'Experience',
      type: 'experience',
      content: '<div class="mb-4"><h3 class="font-semibold text-lg">Senior Software Engineer</h3><p class="text-gray-600">Tech Company Inc. | 2020 - Present</p><ul class="mt-2 list-disc list-inside text-gray-700"><li>Led development of scalable web applications</li><li>Mentored junior developers and improved team productivity</li><li>Implemented CI/CD pipelines reducing deployment time by 50%</li></ul></div>'
    },
    {
      id: 'education',
      title: 'Education',
      type: 'education',
      content: '<div class="mb-4"><h3 class="font-semibold text-lg">Bachelor of Science in Computer Science</h3><p class="text-gray-600">University of Technology | 2016 - 2020</p><p class="text-gray-700 mt-2">GPA: 3.8/4.0 | Dean\'s List | Relevant Coursework: Data Structures, Algorithms, Software Engineering</p></div>'
    },
    {
      id: 'skills',
      title: 'Skills',
      type: 'skills',
      content: '<div class="grid grid-cols-2 gap-4"><div><h4 class="font-semibold mb-2">Programming Languages</h4><p class="text-gray-700">JavaScript, TypeScript, Python, Java</p></div><div><h4 class="font-semibold mb-2">Frameworks & Tools</h4><p class="text-gray-700">React, Next.js, Node.js, Docker, AWS</p></div></div>'
    }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleContentChange = (id: string, content: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, content } : section
    ));
  };

  const downloadPDF = async () => {
    // Import html2pdf dynamically
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = document.getElementById('resume-content');
    const opt = {
      margin: 1,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Resume Builder
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Create and customize your professional resume with drag-and-drop sections
          </p>
          
          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isPreview 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
              }`}
            >
              {isPreview ? '✏️ Edit Mode' : '👁️ Preview Mode'}
            </button>
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="max-w-4xl mx-auto">
          <div id="resume-content" className="bg-white rounded-lg shadow-lg p-8">
            {!isPreview ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {sections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      isPreview={isPreview}
                      onContentChange={handleContentChange}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="space-y-6">
                {sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    isPreview={isPreview}
                    onContentChange={handleContentChange}
                  />
                ))}
              </div>
            )}
          </div>
          
          {!isPreview && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 How to use:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Click on any section content to edit it inline</li>
                <li>• Drag sections by their headers to reorder them</li>
                <li>• Use Preview mode to see the clean final result</li>
                <li>• Download as PDF when you're satisfied with your resume</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Created with Comet Assistant
        </div>
      </div>
    </main>
  );
}
