import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Auth.css';

// Импорт кадров для режима закрытия (hide)
import hideBear0 from '../assets/Bear/Hide/hide_bear0.9771826.png';
import hideBear1 from '../assets/Bear/Hide/hide_bear1.02ebfc5.png';
import hideBear2 from '../assets/Bear/Hide/hide_bear2.3fd96ce.png';
import hideBear3 from '../assets/Bear/Hide/hide_bear3.d93bff7.png';
import hideBear4 from '../assets/Bear/Hide/hide_bear4.3bb674d.png';
import hideBear5 from '../assets/Bear/Hide/hide_bear5.c9504fc.png';

// Импорт кадров для режима наблюдения (watch) – для поля Email
import watchBear0 from '../assets/Bear/Look/watch_bear0.9771826.png';
import watchBear1 from '../assets/Bear/Look/watch_bear1.fea41a0.png';
import watchBear2 from '../assets/Bear/Look/watch_bear2.72739a4.png';
import watchBear3 from '../assets/Bear/Look/watch_bear3.1ea2cae.png';
import watchBear4 from '../assets/Bear/Look/watch_bear4.b7ee0ec.png';
import watchBear5 from '../assets/Bear/Look/watch_bear5.245fa99.png';
import watchBear6 from '../assets/Bear/Look/watch_bear6.b788430.png';
import watchBear7 from '../assets/Bear/Look/watch_bear7.9807292.png';
import watchBear8 from '../assets/Bear/Look/watch_bear8.ca337d0.png';
import watchBear10 from '../assets/Bear/Look/watch_bear10.bfa319b.png';
import watchBear11 from '../assets/Bear/Look/watch_bear11.e21ff32.png';
import watchBear12 from '../assets/Bear/Look/watch_bear12.c957c0b.png';
import watchBear13 from '../assets/Bear/Look/watch_bear13.7ee3a60.png';
import watchBear14 from '../assets/Bear/Look/watch_bear14.de1c88d.png';
import watchBear15 from '../assets/Bear/Look/watch_bear15.f0b6e25.png';
import watchBear16 from '../assets/Bear/Look/watch_bear16.66cda9c.png';
import watchBear17 from '../assets/Bear/Look/watch_bear17.fcbd56d.png';
import watchBear18 from '../assets/Bear/Look/watch_bear18.ab17372.png';
import watchBear19 from '../assets/Bear/Look/watch_bear19.da921eb.png';
import watchBear20 from '../assets/Bear/Look/watch_bear20.c53ab7e.png';

const hideBearImages = [hideBear0, hideBear1, hideBear2, hideBear3, hideBear4, hideBear5];
const watchBearImages = [
  watchBear0,
  watchBear1,
  watchBear2,
  watchBear3,
  watchBear4,
  watchBear5,
  watchBear6,
  watchBear7,
  watchBear8,
  watchBear10,
  watchBear11,
  watchBear12,
  watchBear13,
  watchBear14,
  watchBear15,
  watchBear16,
  watchBear17,
  watchBear18,
  watchBear19,
  watchBear20
];

const Auth = () => {
  // Режим определяется по URL: если содержит "register" – регистрация, иначе логин.
  const location = useLocation();
  const mode = location.pathname.includes("register") ? "register" : "login";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Режим отображения медведя: 'hide' (при вводе пароля) или 'watch' (при вводе Email)
  const [bearMode, setBearMode] = useState("watch");
  // Индекс для режима hide
  const [hideFrame, setHideFrame] = useState(0);
  // Индекс для режима watch (если email пустой, показываем 0)
  const [watchFrame, setWatchFrame] = useState(0);

  // Интервалы для анимации
  const closingIntervalRef = useRef(null);
  const openingIntervalRef = useRef(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/api/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      navigate("/profile");
    } catch (error) {
      alert("Login failed!");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://127.0.0.1:5001/api/register", {
        username,
        password,
      });
      // После успешной регистрации сразу логинимся
      handleLogin();
    } catch (error) {
      alert("Registration failed!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mode === "login" ? handleLogin() : handleRegister();
  };

  // Если email пустой, устанавливаем watchFrame = 0 (стандартное изображение watch_bear0)
  const updateWatchFrame = (text) => {
    if (text.length === 0) {
      setWatchFrame(0);
    } else {
      // Голова повернется каждые 2-3 символа; базис нейтрального взгляда = 11
      const target = 11 + Math.floor((text.length - 6) / 2);
      const clamped = Math.min(19, Math.max(1, target));
      setWatchFrame(clamped);
    }
  };

  const handleEmailChange = (e) => {
    setUsername(e.target.value);
    updateWatchFrame(e.target.value);
  };

  const handleEmailFocus = () => {
    if (closingIntervalRef.current) {
      clearInterval(closingIntervalRef.current);
      closingIntervalRef.current = null;
    }
    if (openingIntervalRef.current) {
      clearInterval(openingIntervalRef.current);
      openingIntervalRef.current = null;
    }
    setBearMode("watch");
    updateWatchFrame(username);
  };

  const handleEmailBlur = () => {
    setBearMode("watch");
    setWatchFrame(0);
  };

  // При фокусе на Password переключаем режим на hide и запускаем анимацию закрытия глаз
  const handlePasswordFocus = () => {
    setBearMode("hide");
    if (openingIntervalRef.current) {
      clearInterval(openingIntervalRef.current);
      openingIntervalRef.current = null;
    }
    if (!closingIntervalRef.current) {
      closingIntervalRef.current = setInterval(() => {
        setHideFrame((prev) => {
          if (prev < hideBearImages.length - 1) return prev + 1;
          clearInterval(closingIntervalRef.current);
          closingIntervalRef.current = null;
          return prev;
        });
      }, 60);
    }
  };

  // При потере фокуса с Password запускаем обратную анимацию hide
  const handlePasswordBlur = () => {
    if (closingIntervalRef.current) {
      clearInterval(closingIntervalRef.current);
      closingIntervalRef.current = null;
    }
    if (!openingIntervalRef.current) {
      openingIntervalRef.current = setInterval(() => {
        setHideFrame((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(openingIntervalRef.current);
          openingIntervalRef.current = null;
          return prev;
        });
      }, 60);
    }
  };

  return (
    <div className="auth-container">
      <h1
        className="welcome-text"
        style={{
          fontWeight: 'bold',
          color: '#eae8ea',
          textAlign: 'center',
          marginBottom: '1rem'
        }}
      >
        {mode === "register" ? "Welcome my friend!" : "Great to see you again!"}
      </h1>
      <div className="auth-bear">
        <img
          src={
            bearMode === "watch"
              ? watchBearImages[watchFrame]
              : hideBearImages[hideFrame]
          }
          alt="bear"
          className="bear-image"
        />
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <span className="input-prefix">Email</span>
          <input
            id="email"
            type="text"
            value={username}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="input-group">
          <span className="input-prefix">Password</span>
          <input
            id="password"
            type="password"
            value={password}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="action-button"
          style={{
            backgroundColor: username && password ? "#647e54" : "#3a5a22",
            color: username && password ? "#fff" : "#bbb",
          }}
        >
          {mode === "login"
            ? "Log in your account"
            : "Create a free account"}
        </button>
      </form>
      <div className="info-text">
        <p>
          By creating an account you agree to our{" "}
          <a href="#terms">Terms of service</a> &amp;{" "}
          <a href="#privacy">Privacy policy</a>
        </p>
        {mode === "register" ? (
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        ) : (
          <p>
            Don't have an account? <Link to="/register">Create a free account</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;