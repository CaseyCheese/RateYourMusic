CREATE DATABASE rateyourmusic;

\c rateyourmusic

CREATE TABLE music(
    id SERIAL PRIMARY KEY,
    title TEXT,
    artist TEXT,
    image_url TEXT,
    year INTEGER,
    genre TEXT,
    isAlbum BOOLEAN
);

INSERT INTO music (title, artist, image_url, year, genre)
VALUES ('Summertime Clothes', 'Animal Collective', 'https://e.snmc.io/i/600/w/bd350f64266874823d0b9931b77a9d6b/2667085/animal-collective-summertime-clothes-Cover-Art.jpg', '2009', 'Pop');

INSERT INTO music (title, artist, image_url, year, genre)
VALUES ('Starseed Activations', 'DJ Coldsteel', 'https://e.snmc.io/i/600/w/6b176d7d673cf803dee90c247af6dc9e/9389843/dj-coldsteel-purifier-Cover-Art.jpg', '2021', 'Trance');

INSERT INTO music (title, artist, image_url, year, genre)
VALUES ('Social Suicide', 'Carl B', 'https://i.discogs.com/CwE1XGtou0loag5OBtvu6H0aXvgMZ02elRKgBDDVBdo/rs:fit/g:sm/q:90/h:600/w:594/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTkwNTgz/Ny0xNjE0NDk4MDYz/LTY0NjAuanBlZw.jpeg', '2006', 'Trance');

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email TEXT,
    password_digest TEXT
);

CREATE TABLE ratings(
    user_id INTEGER REFERENCES music(id) NOT NULL,
    music_id INTEGER REFERENCES users(id) NOT NULL,
    rating DECIMAL,
    PRIMARY KEY (user_id, music_id)
);

INSERT INTO ratings (user_id, music_id, rating)
VALUES ('1', '1', '3'); -- 'I love Summertime Clothes by Animal Collective because of the unique time signature that gives the listener a genuine feeling of chaos in the jungle.'

INSERT INTO ratings (user_id, music_id, rating)
VALUES ('1', '2', '4.5');

INSERT INTO ratings (user_id, music_id, rating)
VALUES ('2', '2', '4');