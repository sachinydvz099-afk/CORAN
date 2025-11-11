import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, renderAPI } from '../api/client';
import { useProjectStore } from '../store/projectStore';
import {
  ArrowLeftIcon,
  PlayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'scenes'>('overview');

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getById(id!);
      setCurrentProject(response.data);
    } catch (err: any) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleRender = async () => {
    try {
      await renderAPI.createJob(id!, {
        render_type: 'final_video',
        resolution: '1080p',
        output_format: 'mp4',
        notify_on_complete: true,
      });
      alert('Render job started! You will be notified when it completes.');
      loadProject();
    } catch (err: any) {
      alert('Failed to start render job');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id!);
        navigate('/dashboard');
      } catch (err: any) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !currentProject) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Project not found'}</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {currentProject.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentProject.description}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRender}
              className="btn-primary flex items-center"
              disabled={currentProject.status === 'processing'}
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Render Video
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {currentProject.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Style</p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {currentProject.style.replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {currentProject.target_length_minutes} min
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Scenes</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {currentProject.scenes?.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'characters', 'scenes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Story Prompt
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {currentProject.prompt_text}
          </p>
        </div>
      )}

      {activeTab === 'characters' && (
        <div>
          {currentProject.characters && currentProject.characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProject.characters.map((character: any) => (
                <div key={character.character_id} className="card">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                    {character.image_url ? (
                      <img
                        src={character.image_url}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {character.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {character.role}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No characters yet. Characters will be generated automatically.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'scenes' && (
        <div>
          {currentProject.scenes && currentProject.scenes.length > 0 ? (
            <div className="space-y-4">
              {currentProject.scenes.map((scene: any) => (
                <div key={scene.scene_id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Scene {scene.scene_number}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {scene.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {scene.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Duration: {scene.start_time_seconds}s - {scene.end_time_seconds}s
                      </p>
                      {scene.dialogue_text && (
                        <p className="text-gray-700 dark:text-gray-300">
                          {scene.dialogue_text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No scenes yet. Scenes will be generated from your story prompt.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
