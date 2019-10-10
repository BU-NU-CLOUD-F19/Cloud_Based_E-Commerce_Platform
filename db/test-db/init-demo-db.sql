--
-- PostgreSQL database cluster dump
--
--
-- Database "cloud_demo" dump
--

--
-- PostgreSQL database dump
--
--
-- Name: cloud_demo; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE cloud_demo WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';

ALTER DATABASE cloud_demo OWNER TO postgres;

\connect cloud_demo

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
-- Name: demo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demo (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.demo OWNER TO postgres;

--
-- Name: demo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.demo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.demo_id_seq OWNER TO postgres;

--
-- Name: demo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.demo_id_seq OWNED BY public.demo.id;


--
-- Name: demo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demo ALTER COLUMN id SET DEFAULT nextval('public.demo_id_seq'::regclass);


--
-- Data for Name: demo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demo (id, name) FROM stdin;
1	alex
2	darshit
3   samarth
4   sujil
\.


--
-- Name: demo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.demo_id_seq', 3, true);


--
-- Name: demo demo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demo
    ADD CONSTRAINT demo_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
