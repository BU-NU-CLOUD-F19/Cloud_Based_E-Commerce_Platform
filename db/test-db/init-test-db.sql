--
-- PostgreSQL database cluster dump
--
-- PostgreSQL database dump
--
-- Dumped from database version 12beta4
-- Dumped by pg_dump version 12beta4

--
-- Name: student_grades; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE student_grades WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';
ALTER DATABASE student_grades OWNER TO postgres;

\connect student_grades

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
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    name character varying(50) NOT NULL,
    number integer NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    student_nuid integer NOT NULL,
    course_number integer NOT NULL,
    grade numeric(5,2),
    CONSTRAINT grades_grade_check CHECK (((grade >= (0)::numeric) AND (grade <= (100)::numeric)))
);


ALTER TABLE public.grades OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    nuid integer NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (name, number) FROM stdin;
Math	4030
Physics	4200
Chemistry	3080
Computer Science	9000
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grades (student_nuid, course_number, grade) FROM stdin;
1234	4030	99.20
4444	4200	65.32
4444	9000	80.00
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (first_name, last_name, nuid) FROM stdin;
John	Doe	1234
Sam	Sung	4444
Bobby	Tables	9090
\.


--
-- Name: courses Courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "Courses_pkey" PRIMARY KEY (number);


--
-- Name: students Students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "Students_pkey" PRIMARY KEY (nuid);


--
-- Name: grades grades_course_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_course_number_fkey FOREIGN KEY (course_number) REFERENCES public.courses(number);


--
-- Name: grades grades_student_nuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_nuid_fkey FOREIGN KEY (student_nuid) REFERENCES public.students(nuid);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

