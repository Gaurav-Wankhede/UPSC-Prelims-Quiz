# UPSC Quiz Generator

An AI-powered quiz generation tool specifically designed for UPSC (Union Public Service Commission) exam preparation. This application automatically generates high-quality, UPSC-style questions from PDF study materials using Google's Gemini 2.0 AI model.

![UPSC Quiz Generator Demo](demo-screenshot.png)

## Features

- 🤖 **AI-Powered Question Generation**: Utilizes Google's Gemini 2.0 Flash Experiment for intelligent question creation
- 📝 **Multiple Question Types**:
  - Statement-Based Questions (Type 1 & 2)
  - List-Based Questions
  - Table-Based Questions (Category Match & Pair Match)
  - Direct Questions
- 📊 **Interactive Quiz Interface**:
  - Real-time progress tracking
  - Immediate feedback on answers
  - Comprehensive explanations
  - Time tracking per question
- 🎯 **UPSC-Focused**:
  - Questions follow UPSC exam patterns
  - Detailed explanations with revision notes
  - Focus on conceptual understanding
- 💫 **Modern UI/UX**:
  - Responsive design
  - Beautiful animations
  - Dark/Light mode support
  - Mobile-friendly interface

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: AI SDK with Google Generative AI
- **PDF Processing**: pdf-parse
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Form Validation**: Zod
- **Development Tools**: ESLint, PostCSS

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/upsc-quiz-generator.git
   cd upsc-quiz-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_google_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Usage

1. Upload a PDF document (max 5MB)
2. Wait for the AI to analyze the content and generate questions
3. Answer the questions in the interactive quiz interface
4. Review your performance and study the detailed explanations
5. Try another PDF or reset the quiz to practice more

## Project Structure

```
├── app/                  # Next.js app directory
├── components/          # React components
├── lib/                # Utility functions and schemas
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🤝 Connect with the Developer

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Gaurav-Wankhede)
[![Portfolio](https://img.shields.io/badge/Portfolio-255E63?style=for-the-badge&logo=About.me&logoColor=white)](https://gaurav-wankhede.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wankhede-gaurav/)

</div>


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vercel](https://vercel.com) for hosting and deployment
- [Google Generative AI](https://ai.google.dev/) for the Gemini 2.0 model
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- All contributors who help improve this project

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ for UPSC aspirants
