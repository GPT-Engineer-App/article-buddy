import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://hopeful-desire-21262e95c7.strapiapp.com/api";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUser(token);
      fetchArticles(token);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchArticles = async (token) => {
    try {
      const response = await fetch(`${API_URL}/articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setArticles(data.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
          email: "test@example.com",
          password: "testpassword",
        }),
      });
      const data = await response.json();
      localStorage.setItem("token", data.jwt);
      setIsLoggedIn(true);
      setUser(data.user);
      fetchArticles(data.jwt);
      toast({
        title: "Registration successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: "Registration failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: "test@example.com",
          password: "testpassword",
        }),
      });
      const data = await response.json();
      localStorage.setItem("token", data.jwt);
      setIsLoggedIn(true);
      setUser(data.user);
      fetchArticles(data.jwt);
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "Login failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    setArticles([]);
    toast({
      title: "Logout successful",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCreateArticle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            title,
            description,
          },
        }),
      });
      const data = await response.json();
      setArticles([...articles, data.data]);
      setTitle("");
      setDescription("");
      toast({
        title: "Article created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: "Failed to create article",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditArticle = async (articleId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            title: "Updated Title",
            description: "Updated Description",
          },
        }),
      });
      const data = await response.json();
      const updatedArticles = articles.map((article) => (article.id === articleId ? data.data : article));
      setArticles(updatedArticles);
      toast({
        title: "Article updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating article:", error);
      toast({
        title: "Failed to update article",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedArticles = articles.filter((article) => article.id !== articleId);
      setArticles(updatedArticles);
      toast({
        title: "Article deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Failed to delete article",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="600px" margin="auto" padding="4">
      <Heading as="h1" size="xl" textAlign="center" marginBottom="8">
        Article Management
      </Heading>
      {!isLoggedIn ? (
        <Stack spacing="4">
          <Button onClick={handleRegister}>Register</Button>
          <Button onClick={handleLogin}>Login</Button>
        </Stack>
      ) : (
        <>
          <Text fontSize="xl" marginBottom="4">
            Welcome, {user?.username}!
          </Text>
          <FormControl marginBottom="4">
            <FormLabel>Title</FormLabel>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl marginBottom="4">
            <FormLabel>Description</FormLabel>
            <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <Button onClick={handleCreateArticle} marginBottom="4">
            Create Article
          </Button>
          <Stack spacing="4">
            {articles.map((article) => (
              <Box key={article.id} borderWidth="1px" borderRadius="md" p="4">
                <Heading as="h2" size="md">
                  {article.attributes.title}
                </Heading>
                <Text>{article.attributes.description}</Text>
                <Stack direction="row" spacing="2" marginTop="2">
                  <Button leftIcon={<FaEdit />} size="sm" onClick={() => handleEditArticle(article.id)}>
                    Edit
                  </Button>
                  <Button leftIcon={<FaTrash />} size="sm" onClick={() => handleDeleteArticle(article.id)}>
                    Delete
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Button onClick={handleLogout} marginTop="8">
            Logout
          </Button>
        </>
      )}
    </Box>
  );
};

export default Index;
