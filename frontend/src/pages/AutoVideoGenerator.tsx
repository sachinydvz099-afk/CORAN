import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface GenerationStatus {
  project_id: string;
  status: string;
  progress: number;
  character_count: number;
  scene_count: number;
  completed_scenes: number;
  final_video_url: string | null;
  characters: Array<{
    name: string;
    role: string;
    image_url: string;
  }>;
  scenes: Array<{
    scene_number: number;
    title: string;
    duration: number;
    status: string;
  }>;
}

export default function AutoVideoGenerator() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    script_text: '',
    target_length_minutes: 40,
    style: '2D_flat'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const animationStyles = [
    { value: '2D_flat', label: '2D Flat - Modern & Clean' },
    { value: '3D', label: '3D Realistic - Depth & Detail' },
    { value: 'anime', label: 'Anime - Japanese Style' },
    { value: 'cartoon', label: 'Cartoon - Vibrant & Fun' },
    { value: 'realistic', label: 'Realistic - Photo-quality' }
  ];

  const exampleScript = `In a medieval kingdom, a young blacksmith named Arin discovers an ancient map leading to a dragon's lair.

ACT 1 - The Discovery
[Workshop - Day]
ARIN (excited): "This map... it's real! The Dragon of Eldoria exists!"
MASTER SMITH (worried): "That path leads only to danger, boy."

ACT 2 - The Journey
Arin climbs the treacherous mountain path, facing fierce storms. His determination never wavers.

ACT 3 - The Confrontation
[Dragon's Lair - Night]
DRAGON (deep): "Why disturb my slumber, mortal?"
ARIN (brave): "I seek not to fight, but to understand."

Their conversation reveals the dragon guards an ancient secret that could save the kingdom...`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.script_text.length < 100) {
      setError('Script must be at least 100 characters long');
      return;
    }

    try {
      setIsGenerating(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/auto-video/generate`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setProjectId(response.data.project_id);
      startPolling(response.data.project_id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start video generation');
      setIsGenerating(false);
    }
  };

  const startPolling = (id: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_URL}/auto-video/status/${id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        setStatus(response.data);

        if (response.data.status === 'completed') {
          clearInterval(pollInterval);
          setIsGenerating(false);
        } else if (response.data.status === 'failed') {
          clearInterval(pollInterval);
          setIsGenerating(false);
          setError('Video generation failed. Please try again.');
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }
    }, 5000); // Poll every 5 seconds
  };

  const loadExampleScript = () => {
    setFormData({
      ...formData,
      title: 'The Dragon\'s Secret',
      script_text: exampleScript
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎬 AI Video Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Transform your script into a complete animated video in minutes
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Powered by OpenAI, Stability AI, and ElevenLabs
          </p>
        </div>

        {!projectId ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="My Epic Adventure"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="A tale of courage and discovery"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Script Text * (min 100 characters)
                    </label>
                    <button
                      type="button"
                      onClick={loadExampleScript}
                      className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                    >
                      Load Example
                    </button>
                  </div>
                  <textarea
                    value={formData.script_text}
                    onChange={(e) => setFormData({ ...formData, script_text: e.target.value })}
                    required
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    placeholder="Write your script here... Include character dialogues, scene descriptions, and actions."
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formData.script_text.length} characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Length (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.target_length_minutes}
                      onChange={(e) => setFormData({ ...formData, target_length_minutes: parseInt(e.target.value) })}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Recommended: 40 minutes for feature-length content
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Animation Style
                    </label>
                    <select
                      value={formData.style}
                      onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      {animationStyles.map(style => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    💡 What happens next?
                  </h3>
                  <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>AI analyzes your script and identifies characters</li>
                    <li>Characters are generated with unique appearances</li>
                    <li>Script is broken into optimally-timed scenes</li>
                    <li>Each scene is rendered with visuals and voice-over</li>
                    <li>All scenes are assembled into final video</li>
                  </ol>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                    ⏱️ Estimated time: {Math.max(10, formData.target_length_minutes / 4)} - {formData.target_length_minutes} minutes
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Starting Generation...' : '🎬 Generate Video'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Video Generation Progress
            </h2>

            {status && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Overall Progress
                    </span>
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {status.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${status.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {status.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Characters</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {status.character_count}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Scenes</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {status.scene_count}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {status.completed_scenes}/{status.scene_count}
                    </p>
                  </div>
                </div>

                {status.characters.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Generated Characters
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {status.characters.map((char, idx) => (
                        <div key={idx} className="text-center">
                          <img
                            src={char.image_url}
                            alt={char.name}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <p className="font-semibold text-gray-900 dark:text-white">{char.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{char.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {status.final_video_url && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
                      ✅ Video Ready!
                    </h3>
                    <a
                      href={status.final_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Download Video
                    </a>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
