"use client";

import React, { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import Image from "next/image";
import LogoutModal from "./LogoutModal";

interface User {
  id: string;
  username: string;
  avatar: string;
}

interface DiscordAuthButtonProps {
  redirectUri: string;
  onAuthSuccess: (user: User) => void;
}

export default function DiscordAuthButton({
  redirectUri,
  onAuthSuccess,
}: DiscordAuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

  const discordAuthUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&scope=identify`;

  const handleLogin = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      window.location.href = discordAuthUrl;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/oAuthDiscord", {
        method: "DELETE",
      });
      setUser(null);
      setHasFetched(false);
      setIsModalOpen(false);
      console.log("Usuário desconectado com sucesso.");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  useEffect(() => {
    const fetchUserFromApi = async () => {
      if (hasFetched || user) return;

      try {
        const response = await fetch("/api/oAuthDiscord", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          onAuthSuccess(userData);
        } else {
          console.warn("Nenhum usuário autenticado encontrado:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      } finally {
        setHasFetched(true);
      }
    };

    fetchUserFromApi();
  }, [user, onAuthSuccess, hasFetched]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !user) {
      fetch("/api/oAuthDiscord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirectUri }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Erro ao autenticar com Discord:", data.error);
            alert(data.error);
          } else {
            const userData = {
              id: data.id,
              username: data.username,
              avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`,
            };
            setUser(userData);
            onAuthSuccess(userData);

            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })
        .catch((error) => {
          console.error("Erro ao autenticar com Discord:", error);
          alert("Falha ao autenticar. Tente novamente.");
        });
    }
  }, [redirectUri, user, onAuthSuccess]);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleLogin}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleLogin();
          }
        }}
        className="flex items-center px-4 py-2 bg-gray-900 text-yellow-400 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 cursor-pointer font-pixel shadow-pixel-art"
        style={{
          fontFamily: '"Press Start 2P", cursive',
          boxShadow: "0px 0px 0px 2px #FFD700",
        }}
      >
        {user ? (
          <>
            <Image
              src={user.avatar}
              alt={user.username}
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="flex-1 text-sm font-bold">{user.username}</span>
          </>
        ) : (
          <>
            <FaDiscord className="w-4 h-4 mr-2" />
            <span className="flex-1 text-sm font-bold">Login with Discord</span>
          </>
        )}
      </div>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
