--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 13.5 (Ubuntu 13.5-0ubuntu0.21.10.1)

-- Started on 2021-11-27 10:48:43 +05

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
-- TOC entry 202 (class 1259 OID 16414)
-- Name: bond; Type: TABLE; Schema: public; Owner: pgadmin
--

CREATE TABLE public.bond (
    security_code character varying(16) NOT NULL,
    bond_type character varying(64),
    face_value numeric(12,4) NOT NULL,
    accrued_interest numeric(12,4) NOT NULL,
    mat_date date NOT NULL,
    bondization numeric(12,4) NOT NULL
);


ALTER TABLE public.bond OWNER TO pgadmin;

--
-- TOC entry 208 (class 1259 OID 16552)
-- Name: currency; Type: TABLE; Schema: public; Owner: pgadmin
--

CREATE TABLE public.currency (
    currency_id character varying(16) NOT NULL,
    name character varying(64) NOT NULL,
    amount numeric(16,4) NOT NULL,
    portfolio_code character varying(32) NOT NULL
);


ALTER TABLE public.currency OWNER TO pgadmin;

--
-- TOC entry 201 (class 1259 OID 16391)
-- Name: portfolio; Type: TABLE; Schema: public; Owner: pgadmin
--

CREATE TABLE public.portfolio (
    code character varying(32) NOT NULL,
    name character varying(128) NOT NULL
);


ALTER TABLE public.portfolio OWNER TO pgadmin;

--
-- TOC entry 205 (class 1259 OID 16521)
-- Name: portfolio_group; Type: TABLE; Schema: public; Owner: pgadmin
--

CREATE TABLE public.portfolio_group (
    portfolio_code character varying(32) NOT NULL,
    group_name character varying(128) NOT NULL,
    id integer NOT NULL,
    parent_id integer,
    target_percent numeric(7,4) NOT NULL
);


ALTER TABLE public.portfolio_group OWNER TO pgadmin;

--
-- TOC entry 206 (class 1259 OID 16524)
-- Name: portfolio_group_id_seq; Type: SEQUENCE; Schema: public; Owner: pgadmin
--

CREATE SEQUENCE public.portfolio_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.portfolio_group_id_seq OWNER TO pgadmin;

--
-- TOC entry 2258 (class 0 OID 0)
-- Dependencies: 206
-- Name: portfolio_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pgadmin
--

ALTER SEQUENCE public.portfolio_group_id_seq OWNED BY public.portfolio_group.id;


--
-- TOC entry 207 (class 1259 OID 16537)
-- Name: portfolio_group_item; Type: TABLE; Schema: public; Owner: pgadmin
--

CREATE TABLE public.portfolio_group_item (
    portfolio_group_id integer NOT NULL,
    security_code character varying(16) NOT NULL
);


ALTER TABLE public.portfolio_group_item OWNER TO pgadmin;

--
-- TOC entry 200 (class 1259 OID 16386)
-- Name: security; Type: TABLE; Schema: public; Owner: pgadmin
--

CREATE TABLE public.security (
    code character varying(16) NOT NULL,
    short_name character varying(16) NOT NULL,
    full_name character varying(128) NOT NULL,
    board_id character varying(32) NOT NULL,
    market character varying(32) NOT NULL,
    engine character varying(32) NOT NULL,
    currency_id character varying(8) NOT NULL,
    type character varying(32) NOT NULL,
    "group" character varying(16) NOT NULL
);


ALTER TABLE public.security OWNER TO pgadmin;

--
-- TOC entry 203 (class 1259 OID 16429)
-- Name: trade; Type: TABLE; Schema: public; Owner: pgadmin
--

CREATE TABLE public.trade (
    id integer NOT NULL,
    portfolio_code character varying(32) NOT NULL,
    type character varying(16) NOT NULL,
    count integer NOT NULL,
    price numeric(12,4) NOT NULL,
    total numeric(12,4) NOT NULL,
    trade_date timestamp without time zone NOT NULL,
    security_code character varying(16) NOT NULL,
    count_multiplier numeric(12,4) DEFAULT 1 NOT NULL
);


ALTER TABLE public.trade OWNER TO pgadmin;

--
-- TOC entry 204 (class 1259 OID 16432)
-- Name: trade_id_seq; Type: SEQUENCE; Schema: public; Owner: pgadmin
--

CREATE SEQUENCE public.trade_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trade_id_seq OWNER TO pgadmin;

--
-- TOC entry 2259 (class 0 OID 0)
-- Dependencies: 204
-- Name: trade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pgadmin
--

ALTER SEQUENCE public.trade_id_seq OWNED BY public.trade.id;


--
-- TOC entry 2095 (class 2604 OID 16526)
-- Name: portfolio_group id; Type: DEFAULT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.portfolio_group ALTER COLUMN id SET DEFAULT nextval('public.portfolio_group_id_seq'::regclass);


--
-- TOC entry 2093 (class 2604 OID 16434)
-- Name: trade id; Type: DEFAULT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.trade ALTER COLUMN id SET DEFAULT nextval('public.trade_id_seq'::regclass);


--
-- TOC entry 2101 (class 2606 OID 16418)
-- Name: bond bond_pkey; Type: CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.bond
    ADD CONSTRAINT bond_pkey PRIMARY KEY (security_code);


--
-- TOC entry 2114 (class 2606 OID 16556)
-- Name: currency currency_pkey; Type: CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (currency_id, portfolio_code);


--
-- TOC entry 2112 (class 2606 OID 16541)
-- Name: portfolio_group_item portfolio_group_item_pkey; Type: CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.portfolio_group_item
    ADD CONSTRAINT portfolio_group_item_pkey PRIMARY KEY (portfolio_group_id, security_code);


--
-- TOC entry 2110 (class 2606 OID 16531)
-- Name: portfolio_group portfolio_group_pkey; Type: CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.portfolio_group
    ADD CONSTRAINT portfolio_group_pkey PRIMARY KEY (id);


--
-- TOC entry 2099 (class 2606 OID 16457)
-- Name: portfolio portfolio_pkey; Type: CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT portfolio_pkey PRIMARY KEY (code);


--
-- TOC entry 2097 (class 2606 OID 16390)
-- Name: security security_pkey; Type: CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.security
    ADD CONSTRAINT security_pkey PRIMARY KEY (code);


--
-- TOC entry 2107 (class 2606 OID 16439)
-- Name: trade trade_pkey; Type: CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.trade
    ADD CONSTRAINT trade_pkey PRIMARY KEY (id);


--
-- TOC entry 2102 (class 1259 OID 16428)
-- Name: mat_date_index; Type: INDEX; Schema: public; Owner: pgadmin
--

CREATE INDEX mat_date_index ON public.bond USING btree (mat_date);


--
-- TOC entry 2103 (class 1259 OID 16476)
-- Name: portfolio_code_index; Type: INDEX; Schema: public; Owner: pgadmin
--

CREATE INDEX portfolio_code_index ON public.trade USING btree (portfolio_code);


--
-- TOC entry 2104 (class 1259 OID 16479)
-- Name: security_code_index; Type: INDEX; Schema: public; Owner: pgadmin
--

CREATE INDEX security_code_index ON public.trade USING btree (security_code);


--
-- TOC entry 2105 (class 1259 OID 16478)
-- Name: trade_date_index; Type: INDEX; Schema: public; Owner: pgadmin
--

CREATE INDEX trade_date_index ON public.trade USING btree (trade_date);


--
-- TOC entry 2108 (class 1259 OID 16477)
-- Name: type_index; Type: INDEX; Schema: public; Owner: pgadmin
--

CREATE INDEX type_index ON public.trade USING btree (type);


--
-- TOC entry 2118 (class 2606 OID 16532)
-- Name: portfolio_group parent_id; Type: FK CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.portfolio_group
    ADD CONSTRAINT parent_id FOREIGN KEY (parent_id) REFERENCES public.portfolio_group(id) NOT VALID;


--
-- TOC entry 2117 (class 2606 OID 16467)
-- Name: trade portfolio; Type: FK CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.trade
    ADD CONSTRAINT portfolio FOREIGN KEY (portfolio_code) REFERENCES public.portfolio(code) NOT VALID;


--
-- TOC entry 2122 (class 2606 OID 16557)
-- Name: currency portfolio_code; Type: FK CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT portfolio_code FOREIGN KEY (portfolio_code) REFERENCES public.portfolio(code) NOT VALID;


--
-- TOC entry 2119 (class 2606 OID 16562)
-- Name: portfolio_group portfolio_code; Type: FK CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.portfolio_group
    ADD CONSTRAINT portfolio_code FOREIGN KEY (portfolio_code) REFERENCES public.portfolio(code) NOT VALID;


--
-- TOC entry 2120 (class 2606 OID 16542)
-- Name: portfolio_group_item portfolio_group_id; Type: FK CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.portfolio_group_item
    ADD CONSTRAINT portfolio_group_id FOREIGN KEY (portfolio_group_id) REFERENCES public.portfolio_group(id) NOT VALID;


--
-- TOC entry 2115 (class 2606 OID 16419)
-- Name: bond security_code; Type: FK CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.bond
    ADD CONSTRAINT security_code FOREIGN KEY (security_code) REFERENCES public.security(code);


--
-- TOC entry 2116 (class 2606 OID 16450)
-- Name: trade security_code; Type: FK CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.trade
    ADD CONSTRAINT security_code FOREIGN KEY (security_code) REFERENCES public.security(code) ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- TOC entry 2121 (class 2606 OID 16547)
-- Name: portfolio_group_item security_code; Type: FK CONSTRAINT; Schema: public; Owner: pgadmin
--

ALTER TABLE ONLY public.portfolio_group_item
    ADD CONSTRAINT security_code FOREIGN KEY (security_code) REFERENCES public.security(code) NOT VALID;


-- Completed on 2021-11-27 10:48:45 +05

--
-- PostgreSQL database dump complete
--

