CREATE DATABASE cloud_demo
ALTER DATABASE cloud_demo OWNER TO postgres;

--
-- Name: student_grades; Type: DATABASE; Schema: -; Owner: postgres
--

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

CREATE TABLE public.demo (id SERIAL PRIMARY KEY,name character varying(50) NOT NULL);


ALTER TABLE public.demo OWNER TO postgres;

--
-- Data for Name: demo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demo (name) FROM stdin;
Alex
Darshit
Karthik
Samarth
Sujil
\.

--
-- PostgreSQL demo database dump complete
--

--
-- PostgreSQL demo database cluster dump complete
--
