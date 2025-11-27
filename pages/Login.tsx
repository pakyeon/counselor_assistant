import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-panel-dark/50 backdrop-blur-sm border border-border-dark rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
              <LayoutDashboard className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white">Counselor Assistant</h1>
          </div>
          <p className="text-gray-400">오신 것을 환영합니다! 로그인해 주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ID / Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
              placeholder="아이디 또는 이메일을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary" />
              로그인 정보 저장
            </label>
            <a href="#" className="text-primary hover:text-primary-hover transition-colors">비밀번호를 잊어버리셨나요?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-primary/25"
          >
            로그인
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-300">비밀번호 찾기</span>
          <span className="mx-3">|</span>
          <span className="cursor-pointer hover:text-gray-300">회원가입</span>
        </div>
      </div>
    </div>
  );
};

export default Login;