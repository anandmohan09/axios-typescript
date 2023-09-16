import React from "react";
import { useEffect, useState } from "react";
// import logo from './logo.svg';
// import './App.css';
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Table from "react-bootstrap/Table";

export type JsonData = {
  id: number;
  title: string;
  body: string;
};
interface ILogin {
  title: string;
  body: string;
}

function App() {
  const [post, setPost] = useState<JsonData[]>([]);
  const [inputData, setInputData] = useState<ILogin>({
    title: "",
    body: "",
  });
  const [selectedPost, setSelectedPost] = useState<JsonData | null>(null);

  const url = "https://jsonplaceholder.typicode.com/posts";

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        // console.log(response.data,'--data--');
        const res = response.data;
        setPost(res);
      })
      .catch((error) => {
        console.log(error, "--error--");
      });
  }, []);
  console.log(post, "--post--");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  console.log(inputData, "--inputData--");
  function createPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post(url, {
        title: inputData.title,
        body: inputData.body,
      })
      .then((response) => {
        const b = response.data;
        setPost([...post, b]);
      });
    setInputData({
      title: "",
      body: "",
    });
  }
  console.log(post, "--post--");
  function deletePost(id: number) {
    console.log(id, "--id--");
    axios.delete(`${url}/${id}`).then((response) => {
      console.log(response.data, "--deletepost--");
      const updatePost = post.filter((item: any) => item.id !== id);
      setPost(updatePost);
    });
  }
  // function updatePost(id:number){
  //   console.log(id,'--editId--');
  //   axios
  //     .put(`${url}/${id}`, {
  //       title: inputData.title,
  //       body: inputData.body
  //     })
  //     .then((response) => {
  //       const e=response.data;
  //       setPost(e);
  //     });

  // }
  function handleEditClick(selectedPost: JsonData) {
    setSelectedPost(selectedPost);
    console.log(selectedPost, "--selectedPost--");
    setInputData({
      title: selectedPost.title,
      body: selectedPost.body,
    });
  }
  function editPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPost) {
      return;
    }
    axios
      .put(`${url}/${selectedPost.id}`, {
        title: inputData.title,
        body: inputData.body,
      })
      .then((response) => {
        const updatedPost = response.data;
        console.log(updatedPost, "--updatedPost--");
        setPost((prevPosts) =>
          prevPosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        );
        setInputData({
          title: "",
          body: "",
        });
        setSelectedPost(null);
      });
  }

  return (
    <>
      <Form onSubmit={selectedPost ? editPost : createPost}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={inputData.title}
            name="title"
            onChange={handleChange}
            type="text"
            placeholder="name@example.com"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Body</Form.Label>
          <Form.Control
            type="text"
            name="body"
            value={inputData.body}
            onChange={handleChange}
            as="textarea"
            rows={3}
          />
        </Form.Group>
        <Button type="submit" variant="success">
          {selectedPost ? "Update" : "Create"}
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Body</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {post
            ? post?.map((ele, id) => {
                return (
                  <>
                    <tr key={ele.id}>
                      <td>{ele.id}</td>
                      <td>{ele.title}</td>
                      <td>{ele.body}</td>
                      <td>
                        <div className="d-flex">
                          <Button
                            onClick={() => handleEditClick(ele)}
                            variant="primary"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => deletePost(ele.id)}
                            className="mx-2"
                            variant="danger"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })
            : null}
        </tbody>
      </Table>
    </>
  );
}
//fgnmfdfgfg
export default App;
