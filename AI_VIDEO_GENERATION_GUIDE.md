# AI-Powered Automated Video Generation Guide

## 🎬 Overview

This project now features **fully automated AI-powered video generation** that can create 40+ minute animated videos from just a script. The system intelligently analyzes your script, generates characters, breaks it into scenes, creates voice-overs, and assembles a complete animated video.

## ✨ Key Features

### 1. **Intelligent Script Analysis**
- Uses OpenAI GPT-4 to analyze your script
- Automatically identifies characters, their roles, and personalities
- Breaks down the script into optimally-timed scenes
- Generates detailed dialogue with emotions
- Suggests visual elements, camera angles, and music

### 2. **AI Character Generation**
- Automatically creates character visuals using Stability AI
- Generates consistent character designs matching your style
- Supports multiple animation styles (2D, 3D, anime, cartoon, realistic)
- Creates detailed character appearance descriptions

### 3. **Voice Synthesis**
- Converts dialogue to natural speech using ElevenLabs
- Matches voice characteristics to character personalities
- Supports emotional voice variations
- Generates synchronized audio for each scene

### 4. **Scene Rendering**
- Creates background environments using AI image generation
- Positions characters in scenes
- Applies camera movements and transitions
- Generates individual scene videos

### 5. **Video Assembly**
- Stitches all scenes into a complete video
- Adds transitions between scenes
- Syncs audio with visuals
- Produces final video in HD (1080p or higher)

## 🚀 Quick Start

### API Endpoint

**Generate a complete video from script:**

```http
POST /api/auto-video/generate
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "My Animated Story",
  "description": "An epic adventure",
  "script_text": "Your full script here (minimum 100 characters)...",
  "target_length_minutes": 40,
  "style": "2D_flat"
}
```

**Response:**
```json
{
  "message": "Video generation started. This may take 10-30 minutes depending on length.",
  "project_id": "60d5ec49f1a2c8b1f8e4e1a1",
  "status": "processing",
  "estimated_time_minutes": 10,
  "workflow": {
    "step1": "Analyzing script with AI",
    "step2": "Generating characters",
    "step3": "Breaking down into scenes",
    "step4": "Rendering each scene",
    "step5": "Assembling final video"
  }
}
```

### Check Generation Status

```http
GET /api/auto-video/status/:project_id
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "project_id": "60d5ec49f1a2c8b1f8e4e1a1",
  "title": "My Animated Story",
  "status": "processing",
  "progress": 45,
  "character_count": 3,
  "scene_count": 20,
  "completed_scenes": 9,
  "target_length_minutes": 40,
  "final_video_url": null,
  "characters": [
    {
      "name": "Hero",
      "role": "protagonist",
      "image_url": "https://..."
    }
  ],
  "scenes": [
    {
      "scene_number": 1,
      "title": "Opening Scene",
      "duration": 120,
      "status": "completed"
    }
  ]
}
```

### Preview Individual Scenes

```http
GET /api/auto-video/preview/:project_id/:scene_number
Authorization: Bearer <your-jwt-token>
```

## 📝 Script Format Guide

### Best Practices

1. **Minimum Length**: At least 100 characters
2. **Optimal Length**: 500-5000 words for 40-minute videos
3. **Structure**: Include clear scenes, character dialogues, and descriptions
4. **Detail**: More descriptive scripts produce better results

### Example Script

```text
Title: The Dragon's Quest

In a medieval kingdom, a young blacksmith named Arin discovers an ancient map 
leading to a dragon's lair. Determined to prove himself, he sets out on a 
perilous journey.

ACT 1 - The Discovery
[Workshop Interior - Day]
ARIN (excited): "This map... it's real! The Dragon of Eldoria actually exists!"
MASTER SMITH (concerned): "That path leads only to danger, boy."

ACT 2 - The Journey
[Mountain Path - Sunset]
Arin climbs the treacherous mountain path, facing fierce storms and wild 
creatures. His determination never wavers.

ACT 3 - The Confrontation
[Dragon's Lair - Night]
The massive dragon emerges from the shadows, its scales glimmering in 
the moonlight.
DRAGON (deep voice): "Why do you disturb my slumber, mortal?"
ARIN (brave): "I seek not to fight you, but to understand."

... continue for desired length ...
```

## 🎨 Animation Styles

Choose from multiple styles:

- **`2D_flat`**: Modern flat design, clean and simple
- **`3D`**: Realistic 3D animation with depth
- **`anime`**: Japanese anime style
- **`cartoon`**: Western cartoon style, vibrant colors
- **`realistic`**: Photo-realistic rendering

## ⚙️ Configuration

### Environment Variables

Add these to your `backend/.env` file:

```env
# Required for AI Video Generation
OPENAI_API_KEY=sk-...          # For script analysis
STABILITY_AI_KEY=sk-...         # For character/scene generation
ELEVENLABS_API_KEY=...          # For voice synthesis
REPLICATE_API_KEY=r8_...        # For video animation (optional)
```

### Getting API Keys

1. **OpenAI**: https://platform.openai.com/api-keys
   - Create account → API Keys → Create new key
   - Cost: ~$0.01-0.05 per video analysis

2. **Stability AI**: https://platform.stability.ai/
   - Sign up → Account → API Keys
   - Cost: ~$0.10 per image generation

3. **ElevenLabs**: https://elevenlabs.io/
   - Create account → Profile → API Keys
   - Free tier: 10,000 characters/month
   - Cost: ~$0.30 per 1000 characters

4. **Replicate** (Optional): https://replicate.com/account/api-tokens
   - For advanced video animation
   - Cost varies by model

## 📊 Processing Timeline

Typical processing times for a 40-minute video:

| Stage | Duration | Description |
|-------|----------|-------------|
| Script Analysis | 30-60 sec | AI analyzes and structures script |
| Character Generation | 2-5 min | Creates 3-5 character images |
| Scene Breakdown | 1-2 min | Generates 20-40 scenes |
| Scene Rendering | 15-30 min | Renders each scene (parallel) |
| Video Assembly | 5-10 min | Stitches and encodes final video |
| **Total** | **23-48 min** | Complete end-to-end process |

## 💡 Advanced Usage

### Custom Character Appearance

Include detailed character descriptions in your script:

```text
CHARACTER: ARIN
- Age: 22 years old
- Build: Athletic, strong from blacksmithing
- Hair: Dark brown, shoulder-length, often tied back
- Eyes: Bright green, determined gaze
- Clothing: Leather apron over simple tunic, worn boots
- Personality: Brave, curious, stubborn but kind-hearted
```

### Scene Direction

Add visual and audio cues:

```text
[VISUAL: Wide establishing shot of the kingdom at dawn]
[AUDIO: Gentle morning birds, distant church bells]
[CAMERA: Slow pan across the village rooftops]

NARRATOR: "In the kingdom of Eldoria, where magic once thrived..."
```

### Dialogue Emotions

Specify how lines should be delivered:

```text
ARIN (excited, yelling): "I found it!"
MASTER SMITH (worried, whispering): "Keep your voice down..."
DRAGON (menacing, deep growl): "You dare challenge me?"
```

## 🎯 Workflow Integration

### Option 1: Fully Automated (Recommended for 40-min videos)

```javascript
// Single API call - complete automation
const response = await fetch('/api/auto-video/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Epic Adventure',
    script_text: longScript,
    target_length_minutes: 40,
    style: '2D_flat'
  })
});

// Poll for status
const projectId = response.project_id;
const interval = setInterval(async () => {
  const status = await fetch(`/api/auto-video/status/${projectId}`);
  if (status.progress === 100) {
    console.log('Video ready!', status.final_video_url);
    clearInterval(interval);
  }
}, 10000); // Check every 10 seconds
```

### Option 2: Manual Control

Use existing endpoints for step-by-step control:

1. Create project: `POST /api/projects`
2. Generate characters: `POST /api/projects/:id/characters`
3. Create scenes: `POST /api/projects/:id/scenes`
4. Render: `POST /api/projects/:id/render`

## 🔍 Troubleshooting

### Common Issues

**Issue**: "Script analysis failed"
- **Solution**: Ensure OPENAI_API_KEY is valid and has credits
- **Alternative**: System will use fallback analysis (basic scene splitting)

**Issue**: "Character generation taking too long"
- **Solution**: Stability AI can be slow; consider reducing character count
- **Alternative**: System uses placeholder avatars as fallback

**Issue**: "Video not generating"
- **Solution**: Check all API keys are configured
- **Verify**: Monitor backend logs for specific errors

### Performance Tips

1. **Optimize script length**: 500-2000 words for 40 minutes
2. **Limit characters**: 3-5 main characters for better quality
3. **Clear scene breaks**: Use ACT/SCENE markers in script
4. **Run during off-peak hours**: AI services may be faster

## 📈 Cost Estimation

For a 40-minute video (typical):

| Service | Usage | Cost |
|---------|-------|------|
| OpenAI GPT-4 | 1 analysis | ~$0.05 |
| Stability AI | 4 characters + 20 scenes | ~$2.40 |
| ElevenLabs | ~5000 words dialogue | ~$1.50 |
| Replicate (optional) | 20 scene animations | ~$10.00 |
| **Total** | | **~$4-14** |

*Costs vary based on API pricing and usage*

## 🎓 Example Use Cases

1. **Educational Content**: Transform lecture scripts into engaging animated lessons
2. **Story Adaptation**: Convert books/short stories into animated films
3. **Marketing Videos**: Create product story animations
4. **Training Materials**: Animate corporate training scenarios
5. **YouTube Content**: Automated story-time animations

## 🔐 Security & Privacy

- All scripts are processed securely
- API keys are never exposed to frontend
- Videos are stored privately (user-specific)
- Option to delete projects after completion

## 📞 Support

For issues or questions:
- Check backend logs: `npm run dev` in backend folder
- Review API documentation: `/API_SPECIFICATION.md`
- Test with shorter videos first (5-10 minutes)

---

**Happy Animating! 🎬✨**

Transform your scripts into professional animated videos with the power of AI!
