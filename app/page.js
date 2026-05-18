"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, LockKeyhole, ArrowRight, Stars } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RESPONSE_WEBHOOK_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

async function sendResponseUpdate(payload) {
  if (!RESPONSE_WEBHOOK_URL || RESPONSE_WEBHOOK_URL.includes("PASTE_YOUR")) {
    console.log("Response update not sent yet. Add your Google Apps Script URL first.", payload);
    return;
  }

  try {
    await fetch(RESPONSE_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Failed to send response update:", error);
  }
}

const floatingItems = [
  { emoji: "💖", left: "8%", delay: 0, duration: 8 },
  { emoji: "✨", left: "18%", delay: 1.2, duration: 10 },
  { emoji: "🌷", left: "31%", delay: 0.6, duration: 9 },
  { emoji: "💗", left: "47%", delay: 1.8, duration: 11 },
  { emoji: "⭐", left: "62%", delay: 0.4, duration: 8.5 },
  { emoji: "🫶", left: "77%", delay: 1.4, duration: 10.5 },
  { emoji: "💞", left: "89%", delay: 0.9, duration: 9.5 },
];

function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {floatingItems.map((item, index) => (
        <motion.div
          key={`${item.emoji}-${index}`}
          className="absolute bottom-[-80px] text-3xl md:text-4xl opacity-80"
          style={{ left: item.left }}
          animate={{
            y: [0, -900],
            x: [0, index % 2 === 0 ? 35 : -35, 0],
            rotate: [0, index % 2 === 0 ? 18 : -18, 0],
            opacity: [0, 0.95, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <motion.div
        className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-white/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function LoginCard({ username, setUsername, onLogin, error }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.96 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 w-full max-w-md"
    >
      <Card className="border-white/30 bg-white/20 shadow-2xl shadow-pink-900/20 backdrop-blur-2xl">
        <CardContent className="p-6 md:p-8">
          <div className="mb-6 flex justify-center">
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white/30 shadow-xl"
              animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <LockKeyhole className="h-9 w-9 text-rose-700" />
            </motion.div>
          </div>

          <div className="text-center">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-medium text-rose-900">
              <Sparkles className="h-4 w-4" /> A little surprise awaits
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-rose-950 md:text-4xl">
              Welcome, beautiful soul
            </h1>
            <p className="mt-3 text-sm leading-6 text-rose-900/90 md:text-base">
              Enter your username to unlock something made with a tiny bit of courage and a lot of heart.
            </p>
          </div>

          <form
            className="mt-7 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              onLogin();
            }}
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-rose-950">
                Username
              </label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Type your username..."
                className="w-full rounded-2xl border border-white/50 bg-white/55 px-4 py-3 text-rose-950 outline-none placeholder:text-rose-700/60 shadow-inner transition focus:border-rose-400 focus:bg-white/75 focus:ring-4 focus:ring-rose-200/60"
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm font-medium text-rose-800"
                >
                  Wrong username
                </motion.p>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl bg-rose-700 text-base font-semibold text-white shadow-xl shadow-rose-900/20 transition hover:bg-rose-800"
            >
              Unlock surprise <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SurpriseScreen({ username, onBack }) {
  const [answer, setAnswer] = useState(null);
  const [noCount, setNoCount] = useState(0);
  const [reason, setReason] = useState("");
  const [savedReason, setSavedReason] = useState("");
  const [afterReasonNoCount, setAfterReasonNoCount] = useState(0);

  const playfulNoMessages = [
    "Why no? Give me one reason first HAHAHA 😭",
    "Aiyoo, still no? Tell me the reason bahh 😆",
    "Okay okay, I hear you... but why not? 😭",
    "Last chance to explain before I become extra dramatic 😂",
  ];

  const currentNoMessage =
    playfulNoMessages[Math.min(noCount, playfulNoMessages.length - 1)];

  const greeting = useMemo(() => {
    const cleanName = username.trim();
    return cleanName ? cleanName : "you";
  }, [username]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 px-2"
    >
      <div className="text-center">
        <motion.div
          className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/25 shadow-2xl backdrop-blur-xl"
          animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-12 w-12 fill-rose-600 text-rose-600" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold text-rose-950"
        >
          <Stars className="h-4 w-4" /> Unlocked just for {greeting}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-4xl font-black tracking-tight text-rose-950 md:text-6xl"
        >
          I have a crush on you.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-8 text-rose-950/85 md:text-lg"
        >
          If you noticed this page or already logged in, I just want to say that I have a crush on you.
          I’m always waiting for your posts... ehh, feed ke? Ehh, story bahh 😅 I always follow up with your stories.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="w-full max-w-2xl rounded-[2rem] border border-white/40 bg-white/25 p-6 text-center shadow-2xl shadow-rose-900/15 backdrop-blur-2xl md:p-8"
      >
        <p className="text-xl font-bold text-rose-950 md:text-3xl">
          Would you accept to be my girlfriend?
        </p>

        {!answer ? (
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => {
                setAnswer("yes");
                sendResponseUpdate({
                  username: greeting,
                  answer: "yes",
                  reason: "Accepted immediately",
                });
              }}
              className="h-14 rounded-2xl bg-rose-700 px-10 text-lg font-bold text-white shadow-xl shadow-rose-900/20 transition hover:bg-rose-800"
            >
              Yes 💖
            </Button>

            <Button
              onClick={() => {
                setAnswer("no");
                setNoCount((count) => count + 1);
              }}
              variant="outline"
              className="h-14 rounded-2xl border-white/60 bg-white/35 px-10 text-lg font-bold text-rose-950 backdrop-blur-xl hover:bg-white/55"
            >
              No 🙈
            </Button>
          </div>
        ) : answer === "yes" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-3xl bg-white/35 p-5 text-rose-950 shadow-xl"
          >
            <div className="text-5xl">🥹💗</div>
            <p className="mt-3 text-xl font-extrabold">
              You just made me the happiest person.
            </p>
            <p className="mt-2 text-sm md:text-base">
              I promise this little website will always remember this moment.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-3xl bg-white/35 p-5 text-rose-950 shadow-xl"
          >
            <div className="text-5xl">🥲😂</div>
            <p className="mt-3 text-xl font-extrabold">{currentNoMessage}</p>
            <p className="mt-2 text-sm md:text-base">
              I promise I’m just being playful here — but I still want to know your reason.
            </p>

            {!savedReason ? (
              <div className="mx-auto mt-5 max-w-xl space-y-3 text-left">
                <label className="block text-sm font-semibold text-rose-950">
                  Your reason
                </label>

                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Type your reason here..."
                  className="min-h-[110px] w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-rose-950 outline-none placeholder:text-rose-700/60 shadow-inner transition focus:border-rose-400 focus:bg-white/80 focus:ring-4 focus:ring-rose-200/60"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    onClick={() => {
                      if (reason.trim()) {
                        const cleanReason = reason.trim();
                        setSavedReason(cleanReason);
                        sendResponseUpdate({
                          username: greeting,
                          answer: "no",
                          reason: cleanReason,
                        });
                      }
                    }}
                    className="h-12 rounded-2xl bg-rose-700 px-6 font-bold text-white hover:bg-rose-800"
                  >
                    Send reason 😭
                  </Button>

                  <Button
                    onClick={() => {
                      setAnswer("yes");
                      sendResponseUpdate({
                        username: greeting,
                        answer: "yes_after_initial_no",
                        reason: reason.trim() || "Clicked yes before submitting reason",
                      });
                    }}
                    variant="outline"
                    className="h-12 rounded-2xl border-white/60 bg-white/35 px-6 font-bold text-rose-950 backdrop-blur-xl hover:bg-white/55"
                  >
                    Okay yes lah 💖
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl bg-white/45 p-4">
                <p className="text-sm font-semibold text-rose-900">Your reason:</p>
                <p className="mt-2 text-base italic text-rose-950">“{savedReason}”</p>

                <p className="mt-4 text-base font-bold text-rose-950">
                  {afterReasonNoCount >= 3
                    ? "Okay okay, no more No button. The website has decided: YES only HAHAHA 💖"
                    : "Thank you for telling me... but are you sure not yes? HAHAHA 😭"}
                </p>

                {afterReasonNoCount >= 3 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {["Yes 💖", "Yes yes 🥹", "YES lah 😭💗"].map((label) => (
                      <Button
                        key={label}
                        onClick={() => {
                          setAnswer("yes");
                          sendResponseUpdate({
                            username: greeting,
                            answer: "yes_after_no",
                            reason: savedReason || "Changed to yes after saying no",
                          });
                        }}
                        className="h-12 rounded-2xl bg-rose-700 px-6 font-bold text-white hover:bg-rose-800"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                      onClick={() => {
                        setAnswer("yes");
                        sendResponseUpdate({
                          username: greeting,
                          answer: "yes_after_no",
                          reason: savedReason || "Changed to yes after saying no",
                        });
                      }}
                      className="h-12 rounded-2xl bg-rose-700 px-6 font-bold text-white hover:bg-rose-800"
                    >
                      Fine, yes 💖
                    </Button>

                    <Button
                      onClick={() => {
                        setAfterReasonNoCount((count) => count + 1);
                        setNoCount((count) => count + 1);
                      }}
                      variant="outline"
                      className="h-12 rounded-2xl border-white/60 bg-white/35 px-6 font-bold text-rose-950 backdrop-blur-xl hover:bg-white/55"
                    >
                      No 😂
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      <Button
        onClick={onBack}
        variant="outline"
        className="rounded-2xl border-white/50 bg-white/25 px-6 text-rose-950 backdrop-blur-xl hover:bg-white/40"
      >
        Back to login
      </Button>
    </motion.div>
  );
}

export default function CrushAnimationWebsite() {
  const [username, setUsername] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = () => {
    const allowedUsernames = ["mshaelya", "misha"];
    const normalizedUsername = username.trim().toLowerCase();

    if (!allowedUsernames.includes(normalizedUsername)) {
      setError(true);
      return;
    }

    setError(false);
    setUsername(normalizedUsername);
    setIsUnlocked(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-100 via-pink-200 to-fuchsia-200 px-4 py-8 text-rose-950">
      <FloatingBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.45),transparent_30%)]" />

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <LoginCard
              key="login"
              username={username}
              setUsername={setUsername}
              onLogin={handleLogin}
              error={error}
            />
          ) : (
            <SurpriseScreen
              key="surprise"
              username={username}
              onBack={() => setIsUnlocked(false)}
            />
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}