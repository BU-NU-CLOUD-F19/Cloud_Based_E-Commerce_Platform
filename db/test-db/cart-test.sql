--
-- PostgreSQL database dump complete
--

--
-- Database "cloud_ecommerce" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.0
-- Dumped by pg_dump version 12.0

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

--
-- Name: cloud_ecommerce; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE cloud_ecommerce WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE cloud_ecommerce OWNER TO postgres;

\connect cloud_ecommerce

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
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    cartid character varying(50) NOT NULL,
    date_created timestamp with time zone NOT NULL,
    date_modified timestamp with time zone,
    uid character varying(20) NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    oid integer NOT NULL,
    total_price real NOT NULL,
    date timestamp with time zone NOT NULL,
    destination character varying(50) NOT NULL,
    shipping real NOT NULL,
    uid character varying(20),
    CONSTRAINT orders_shipping_check CHECK ((shipping >= (0)::double precision)),
    CONSTRAINT orders_total_price_check CHECK ((total_price >= (0)::double precision))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    pid integer NOT NULL,
    pcode character varying(50),
    price real,
    sku character varying(50) NOT NULL,
    amount_in_stock integer,
    pname character varying(50) NOT NULL,
    description text NOT NULL,
    lang character varying(7) NOT NULL,
    CONSTRAINT products_amount_in_stock_check CHECK ((amount_in_stock >= 0)),
    CONSTRAINT products_price_check CHECK (((price IS NULL) OR (price >= (0)::double precision)))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_in_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_in_cart (
    cartid character varying(50) NOT NULL,
    pid integer NOT NULL,
    amount_in_cart integer NOT NULL,
    date_added timestamp with time zone NOT NULL,
    CONSTRAINT products_in_cart_amount_in_cart_check CHECK ((amount_in_cart > 0))
);


ALTER TABLE public.products_in_cart OWNER TO postgres;

--
-- Name: products_in_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_in_order (
    oid integer NOT NULL,
    pid integer NOT NULL,
    amount_in_order integer NOT NULL,
    CONSTRAINT products_in_order_amount_in_order_check CHECK ((amount_in_order > 0))
);


ALTER TABLE public.products_in_order OWNER TO postgres;

--
-- Name: products_pid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_pid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_pid_seq OWNER TO postgres;

--
-- Name: products_pid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_pid_seq OWNED BY public.products.pid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    uid character varying(20) NOT NULL,
    fname character varying(50) NOT NULL,
    lname character varying(50) NOT NULL,
    address character varying(50) NOT NULL,
    phone numeric(10,0) NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(100)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: products pid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN pid SET DEFAULT nextval('public.products_pid_seq'::regclass);


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (cartid, date_created, date_modified, uid) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (oid, total_price, date, destination, shipping, uid) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (pid, pcode, price, sku, amount_in_stock, pname, description, lang) FROM stdin;
1	ABC123	42.5	XYZ	10	Something	This is something very interesting that you want to buy.	en_US
\.


--
-- Data for Name: products_in_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_in_cart (cartid, pid, amount_in_cart, date_added) FROM stdin;
\.


--
-- Data for Name: products_in_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_in_order (oid, pid, amount_in_order) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (uid, fname, lname, address, phone, email, password) FROM stdin;
user1	John	Doe	Made Up Street 42	124124124	john@doe.com	\N
\.


--
-- Name: products_pid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_pid_seq', 1, false);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cartid);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (oid);


--
-- Name: products_in_cart products_in_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_cart
    ADD CONSTRAINT products_in_cart_pkey PRIMARY KEY (cartid, pid);


--
-- Name: products_in_order products_in_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_order
    ADD CONSTRAINT products_in_order_pkey PRIMARY KEY (oid, pid);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (pid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uid);


--
-- Name: carts carts_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid);


--
-- Name: orders orders_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid);


--
-- Name: products_in_cart products_in_cart_cartid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_cart
    ADD CONSTRAINT products_in_cart_cartid_fkey FOREIGN KEY (cartid) REFERENCES public.carts(cartid);


--
-- Name: products_in_cart products_in_cart_pid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_cart
    ADD CONSTRAINT products_in_cart_pid_fkey FOREIGN KEY (pid) REFERENCES public.products(pid);


--
-- Name: products_in_order products_in_order_oid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_order
    ADD CONSTRAINT products_in_order_oid_fkey FOREIGN KEY (oid) REFERENCES public.orders(oid);


--
-- Name: products_in_order products_in_order_pid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_in_order
    ADD CONSTRAINT products_in_order_pid_fkey FOREIGN KEY (pid) REFERENCES public.products(pid);


--
-- PostgreSQL database dump complete
--
