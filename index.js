const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Marys Poppendieck",
    number: "39-23-6423122",
  },
];
// app.get("/", (request, response) => {
//   response.send(
//     '<h1 style="font-size: 10rem;   display: flex;  justify-content: center;  align-items: center;height:80% " ></h1>'
//   );
// });
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/info", (request, response) => {
  const info = ` <h3>Phonebook has info for ${
    persons.length
  } people </h3> <h2>${new Date()}</h2> `;
  response.send(info);
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).send(`bad id ${id}`);
  }
  response.json(person);
});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.random();
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "phone missing",
    });
  }
  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/api/persons`);
});
