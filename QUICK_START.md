# 🚀 Quick Start Guide - AI Video Generator

## ⚡ 3-Minute Setup

### 1️⃣ Get API Keys (5 minutes)

Visit these sites and get your free API keys:

- **OpenAI**: https://platform.openai.com/api-keys
  - Sign up → API Keys → Create new key
  - Copy the key starting with `sk-`

- **Stability AI**: https://platform.stability.ai/
  - Sign up → Account → API Keys
  - Copy the key starting with `sk-`

- **ElevenLabs**: https://elevenlabs.io/
  - Sign up → Profile → API Keys
  - Copy your API key
  - Free tier: 10,000 characters/month

### 2️⃣ Configure Environment (1 minute)

1. Copy `backend/.env.example` to `backend/.env`
2. Open `backend/.env` in a text editor
3. Add your API keys:

```env
OPENAI_API_KEY=sk-your-openai-key-here
STABILITY_AI_KEY=sk-your-stability-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here
```

### 3️⃣ Install & Run (2 minutes)

**Option A: Automated (Windows)**
```bash
quick-setup.bat
```

**Option B: Automated (Mac/Linux)**
```bash
chmod +x quick-setup.sh
./quick-setup.sh
```

**Option C: Manual**
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### 4️⃣ Generate Your First Video

1. Open: http://localhost:5173/auto-video
2. Click "Load Example" to get a sample script
3. Or write your own (minimum 100 characters)
4. Click "🎬 Generate Video"
5. Wait 10-30 minutes (grab a coffee! ☕)
6. Download your 40-minute animated video!

---

## 📝 Example Script Template

```text
Title: The Dragon's Quest

In a medieval kingdom, a young blacksmith named Arin 
discovers an ancient map leading to a dragon's lair.

ACT 1 - The Discovery
[Workshop - Day]
ARIN (excited): "This map... it's real!"
MASTER SMITH (worried): "That path leads to danger."

ACT 2 - The Journey
Arin climbs the mountain, facing fierce storms.

ACT 3 - The Confrontation
[Dragon's Lair - Night]
DRAGON (deep): "Why disturb my slumber?"
ARIN (brave): "I seek understanding."

... continue for ~2000 words for 40 minutes ...
```

---

## 🎯 API Endpoints

### Generate Video
```http
POST http://localhost:3000/api/auto-video/generate
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "My Video",
  "script_text": "Your script here...",
  "target_length_minutes": 40,
  "style": "2D_flat"
}
```

### Check Status
```http
GET http://localhost:3000/api/auto-video/status/:project_id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🎨 Animation Styles

Choose from:
- `2D_flat` - Modern, clean design
- `3D` - Realistic with depth
- `anime` - Japanese animation
- `cartoon` - Vibrant Western style
- `realistic` - Photo-realistic

---

## ⏱️ Processing Time

| Video Length | Time |
|-------------|------|
| 5 minutes | 5-10 min |
| 10 minutes | 8-15 min |
| 20 minutes | 15-25 min |
| 40 minutes | 23-48 min |

---

## 💰 Costs

Typical 40-minute video:
- OpenAI: ~$0.05
- Stability AI: ~$2.40
- ElevenLabs: ~$1.50
- **Total: ~$4.00**

---

## 🐛 Troubleshooting

**Problem**: "API key invalid"
- Check keys are correct in `backend/.env`
- Ensure no extra spaces
- Restart backend server

**Problem**: "MongoDB connection failed"
- Install MongoDB: https://www.mongodb.com/try/download/community
- Start MongoDB service

**Problem**: "Generation stuck at 0%"
- Check backend logs for errors
- Verify API keys have credits
- Try a shorter script first (5 min)

**Problem**: "No characters appearing"
- Stability AI may be slow
- System will use placeholder avatars
- Check Stability AI API status

---

## 📚 Documentation

- **AI_VIDEO_GENERATION_GUIDE.md** - Complete guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **TRANSFORMATION_COMPLETE.md** - What changed
- **README.md** - Project overview

---

## ✅ Quick Checklist

- [ ] Got API keys from OpenAI, Stability AI, ElevenLabs
- [ ] Created `backend/.env` file
- [ ] Added API keys to `.env`
- [ ] MongoDB installed and running
- [ ] Ran `npm install` in backend and frontend
- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:5173
- [ ] Can access http://localhost:5173/auto-video
- [ ] Generated first test video!

---

## 🎬 Tips for Best Results

1. **Script Length**: 500-2000 words for 40 minutes
2. **Character Count**: 3-5 main characters
3. **Scene Markers**: Use ACT/SCENE labels
4. **Dialogue**: Include character names and emotions
5. **Descriptions**: Add visual details for backgrounds
6. **Test First**: Try a 5-minute video before 40 minutes

---

## 🎉 You're Ready!

That's it! You can now generate professional 40-minute animated videos from simple scripts.

**Need help?** Check the documentation files or backend logs.

**Happy Creating! 🎬✨**
