CREATE TABLE IF NOT EXISTS categories (
    id serial PRIMARY KEY,
    name varchar NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS topics (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    category_id integer REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS questions (
    id serial PRIMARY KEY,
    text varchar NOT NULL,
    votes integer DEFAULT 0 NOT NULL,
    topic_id integer REFERENCES topics(id),
    answers integer DEFAULT 0 NOT NULL,
    q_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
    id serial PRIMARY KEY,
    text varchar NOT NULL,
    question_id integer REFERENCES questions(id),
    votes integer DEFAULT 0 NOT NULL,
    a_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id serial PRIMARY KEY,
    name varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS questions_tags (
    question_id integer REFERENCES questions(id),
    tag_id integer REFERENCES tags(id),
    PRIMARY KEY (question_id, tag_id)
);

CREATE TABLE IF NOT EXISTS roles (
    id serial PRIMARY KEY,
    value varchar NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    email varchar NOT NULL UNIQUE,
    is_active boolean NOT NULL,
    role_id integer REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS questions_users (
    question_id integer REFERENCES questions(id),
    user_id integer REFERENCES users(id),
    vote_date TIMESTAMP NOT NULL,
    PRIMARY KEY (question_id, user_id)
);

CREATE TABLE IF NOT EXISTS answers_users (
    answer_id integer REFERENCES answers(id),
    user_id integer REFERENCES users(id),
    vote_date TIMESTAMP NOT NULL,
    PRIMARY KEY (answer_id, user_id)
);

CREATE TABLE IF NOT EXISTS improvement_request (
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    improv_type varchar NOT NULL,
    request varchar NOT NULL,
    req_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS registration_links (
    user_id integer references users(id),
    link varchar NOT NULL UNIQUE ,
    expiry_date TIMESTAMP NOT NULL
);

INSERT INTO roles (value) VALUES ('ADMIN');
INSERT INTO roles (value) VALUES ('SUPPORT');
INSERT INTO roles (value) VALUES ('USER');
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('admin', '$2y$10$BLMZFAnCPXX0cVRmdPP3Meu3NR/xWucAyQ4aAW2z57RlLdLPvH0Hi', 1, 'admin@gimme.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('support', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 2, 'suport@gimme.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('tchrys', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'tchyrs@gmail.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('dummy1', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'dummy1@gmail.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('dummy2', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'dummy2@gmail.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('dummy3', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'dummy3@gmail.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('cici', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'cici@gmail.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('meme', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'meme@gmail.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('sirilie', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'sirilie@gmail.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('misterdumitrescu', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'mister@gmail.com', true);
INSERT INTO users (username, password, role_id, email, is_active)
    VALUES ('ianishagi', '$2a$10$tqezTtINk3FMQvOCrWjnOOjfj.z67CImnPgwFPsckugcP7e8xCw.C', 3, 'ianis@faianta.com', true);

INSERT INTO categories(name) VALUES ('Movies');
INSERT INTO categories(name) VALUES ('TV Shows');
INSERT INTO categories(name) VALUES ('Football');
INSERT INTO categories(name) VALUES ('Music');
INSERT INTO categories(name) VALUES ('Funny');
INSERT INTO categories(name) VALUES ('Food');

INSERT INTO topics (name, category_id) VALUES ('Main', 1);
INSERT INTO topics (name, category_id) VALUES ('Oscars', 1);
INSERT INTO topics (name, category_id) VALUES ('Golden globes', 1);
INSERT INTO topics (name, category_id) VALUES ('60s', 1);
INSERT INTO topics (name, category_id) VALUES ('70s', 1);
INSERT INTO topics (name, category_id) VALUES ('80s', 1);
INSERT INTO topics (name, category_id) VALUES ('90s', 1);
INSERT INTO topics (name, category_id) VALUES ('Crime', 1);
INSERT INTO topics (name, category_id) VALUES ('Drama', 1);
INSERT INTO topics (name, category_id) VALUES ('Comedy', 1);

INSERT INTO topics (name, category_id) VALUES ('Main', 2);
INSERT INTO topics (name, category_id) VALUES ('Golden globes', 2);
INSERT INTO topics (name, category_id) VALUES ('Sitcom', 2);
INSERT INTO topics (name, category_id) VALUES ('Crime', 2);
INSERT INTO topics (name, category_id) VALUES ('Drama', 2);
INSERT INTO topics (name, category_id) VALUES ('SF', 2);

INSERT INTO topics (name, category_id) VALUES ('Main', 3);
INSERT INTO topics (name, category_id) VALUES ('Champions League', 3);
INSERT INTO topics (name, category_id) VALUES ('Europa League', 3);
INSERT INTO topics (name, category_id) VALUES ('National Teams', 3);
INSERT INTO topics (name, category_id) VALUES ('Trivia', 3);

INSERT INTO topics (name, category_id) VALUES ('Main', 4);
INSERT INTO topics (name, category_id) VALUES ('50s', 4);
INSERT INTO topics (name, category_id) VALUES ('60s', 4);
INSERT INTO topics (name, category_id) VALUES ('70s', 4);
INSERT INTO topics (name, category_id) VALUES ('80s', 4);
INSERT INTO topics (name, category_id) VALUES ('90s', 4);
INSERT INTO topics (name, category_id) VALUES ('Rap', 4);
INSERT INTO topics (name, category_id) VALUES ('Pop', 4);

INSERT INTO topics (name, category_id) VALUES ('Memes', 5);
INSERT INTO topics (name, category_id) VALUES ('Stand-up comedy', 5);

INSERT INTO topics (name, category_id) VALUES ('Main', 6);
INSERT INTO topics (name, category_id) VALUES ('VeganCircleJerk', 6);
INSERT INTO topics (name, category_id) VALUES ('KetoCircleJerk', 6);
