import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { projectAPI } from '../api/client';
import { useProjectStore } from '../store/projectStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ProjectForm {
  title: string;
  description: string;
  prompt_text: string;
  target_length_minutes: number;
  style: string;
}

const ANIMATION_STYLES = [
  { value: '2D_flat', label: '2D Flat', description: 'Clean, modern flat design' },
  { value: '3D', label: '3D Realistic', description: 'Detailed 3D rendering' },
  { value: 'anime', label: 'Anime', description: 'Japanese animation style' },
  { value: 'cartoon', label: 'Cartoon', description: 'Western cartoon style' },
  { value: 'realistic', label: 'Realistic', description: 'Photo-realistic rendering' },
];

export default function CreateProject() {
  const navigate = useNavigate();
  const { addProject } = useProjectStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectForm>({
    defaultValues: {
      target_length_minutes: 40,
      style: '2D_flat',
    },
  });

  const onSubmit = async (data: ProjectForm) => {
    try {
      setLoading(true);
      setError('');
      const response = await projectAPI.create(data);
      addProject(response.data);
      navigate(`/projects/${response.data.project_id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Animation Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tell us your story and we'll create an amazing animated video
        </p>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="input-field"
              placeholder="My Epic Animation"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field"
              placeholder="A brief description of your animation project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Story Prompt *
            </label>
            <textarea
              {...register('prompt_text', {
                required: 'Story prompt is required',
                minLength: { value: 10, message: 'Please provide more details' },
              })}
              rows={6}
              className="input-field"
              placeholder="A young blacksmith in a medieval kingdom rises to defeat a dragon. Write your full story here..."
            />
            {errors.prompt_text && (
              <p className="mt-1 text-sm text-red-600">{errors.prompt_text.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Provide a detailed story prompt. The AI will generate characters, scenes, and dialogue.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Length (minutes) *
            </label>
            <input
              {...register('target_length_minutes', {
                required: 'Length is required',
                min: { value: 1, message: 'Minimum 1 minute' },
                max: { value: 120, message: 'Maximum 120 minutes' },
              })}
              type="number"
              min="1"
              max="120"
              className="input-field"
            />
            {errors.target_length_minutes && (
              <p className="mt-1 text-sm text-red-600">{errors.target_length_minutes.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Animation Style *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ANIMATION_STYLES.map((style) => (
                <label
                  key={style.value}
                  className="relative flex cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-4 hover:border-primary-500 dark:hover:border-primary-400"
                >
                  <input
                    {...register('style')}
                    type="radio"
                    value={style.value}
                    className="sr-only"
                  />
                  <div className="flex flex-1">
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">
                        {style.label}
                      </span>
                      <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {style.description}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
