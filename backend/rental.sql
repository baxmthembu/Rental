--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: property_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_info (
    id integer NOT NULL,
    users_id integer,
    address character varying(255) NOT NULL,
    bedrooms integer NOT NULL,
    bathrooms integer NOT NULL,
    price numeric(10,2) NOT NULL,
    description character varying(255) NOT NULL,
    property_type character varying(255) NOT NULL,
    image_url character varying(2000),
    phone_number character varying(10) NOT NULL,
    email character varying(30) NOT NULL,
    name character varying(255)
);


ALTER TABLE public.property_info OWNER TO postgres;

--
-- Name: property_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_info_id_seq OWNER TO postgres;

--
-- Name: property_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_info_id_seq OWNED BY public.property_info.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(100),
    logged_in boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: property_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_info ALTER COLUMN id SET DEFAULT nextval('public.property_info_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: property_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_info (id, users_id, address, bedrooms, bathrooms, price, description, property_type, image_url, phone_number, email, name) FROM stdin;
34	5	62 Bhejane Road KwaMashu G	2	2	5000.00	Nice apartment with pool and parking garage	apartment	https://res.cloudinary.com/dp9gjl43m/image/upload/v1732277286/public/images/yzwcaaenlgakawbwkrpe.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1732277287/public/images/mqd74l3wnwkxcm9jkldr.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1732277289/public/images/ccvplthhdlfyhpbmj8gi.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1732277288/public/images/h2gn9mnln9zqg9pu6rjm.jpg	0651125756	baxmthembu@gmail.com	Xolani Mthethwa
37	5	23 Malandela Road Ntuzuma F	1	1	7500.00	Nice house for starter family	house	https://res.cloudinary.com/dp9gjl43m/image/upload/v1732391772/public/images/cuylqxiekumtes0qljas.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1732391773/public/images/ou77iwpkt2fgjrcfr9qz.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1732391772/public/images/pqsiyjq4ib83ng6kxc2o.jpg	0651125758	baxmthembu2002@gmail.com	Xolani Mthethwa
38	5	45 Amanzimnyama Road KwaMashu C	2	2	9000.00	family house	house	https://res.cloudinary.com/dp9gjl43m/image/upload/v1732394220/public/images/a7pv1hditalj41kc77dy.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1732394220/public/images/bih1jmizv9jykqdgumix.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1732394220/public/images/le7aj0bi0fln5vrgbkyd.jpg	0732843293	bongumusa32@gmail.com	Xolani Mthethwa
39	5	kwadabeka	1	1	2300.00	house	backroom	https://res.cloudinary.com/dp9gjl43m/image/upload/v1739470065/public/images/mcju8vhmn4bxzorqa2ey.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1739470065/public/images/shfl3vfvzx2qb43u8dth.jpg,https://res.cloudinary.com/dp9gjl43m/image/upload/v1739470065/public/images/xudqhk2pdcxlppbhf5nl.jpg	0315436778	bdladla@gmail.com	Xolani Mthethwa
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, logged_in) FROM stdin;
7	Linda Mntambo	lindamntambo@gmail.com	$2b$10$7zxnwmypEckkZ1uc/SZLhOxXP3oaEYYm8LBR0vOtIGSMGdkFV0sHO	owner	f
8	Sizakele Mthembu	sizakelemthembu732@gmail.com	$2b$10$FUfVUxY2Y5fFbSb9pX244u2e2M0P0nwAdtndOyg6cSzlEMuZbLyGG	owner	f
18	Aphiwe Mthembu	bmthembu2002@gmail.com	$2b$10$2XDGh.1y0fobkGMzaWuNjeZ/jXE7XBGWnjc91DTHCO0xnXqPTkauG	owner	f
19	Aphiwe Mthembu	bmthembu2003@gmail.com	$2b$10$EfGQQTVHGYfvO/58In4lyeYd100QtgbpusOBbBSM.g7ycJXDQZ9TS	owner	\N
20	Sizakele Mthembu	dylandunn69@gmail.com	$2b$10$YvLFZUUOz.EqsHgdr.81EOcfDM5JJWKdnxTJ5BR/gvuicxrTPRU/q	owner	\N
21	Sizakele Mthembu	dylandunn698@gmail.com	$2b$10$db2FaomSMuoowhEbeEDoVet20.LmUgRDUqArwVW2OY43YpSN/9kiO	owner	\N
22	Lungelo Mngadi	lungelomngadi836@gmail.com	$2b$10$sHSdXINg8afQ5DpTQ5GAu.dDO8MbOtll9auh90buhOkA70jngVASS	owner	f
5	Xolani Mthethwa	xolanimthetha123@gmail.com	$2b$10$PidRYx9auuXUcbCTj32y9u5nUixlRizznroWkMjZraLsTyPar5eb6	owner	t
\.


--
-- Name: property_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_info_id_seq', 39, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


--
-- Name: property_info property_info_address_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_info
    ADD CONSTRAINT property_info_address_key UNIQUE (address);


--
-- Name: property_info property_info_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_info
    ADD CONSTRAINT property_info_email_key UNIQUE (email);


--
-- Name: property_info property_info_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_info
    ADD CONSTRAINT property_info_phone_number_key UNIQUE (phone_number);


--
-- Name: property_info property_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_info
    ADD CONSTRAINT property_info_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: property_info property_info_users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_info
    ADD CONSTRAINT property_info_users_id_fkey FOREIGN KEY (users_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

