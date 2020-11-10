CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR,
    id_position INT,
    id_responsible INT,
    name VARCHAR,
    role INT,
    surname VARCHAR,
    cost_center_sender VARCHAR,
    full_name VARCHAR,
    active SMALLINT,
    valid_from BIGINT,
    valid_to BIGINT,
    created_at BIGINT,
    updated_at BIGINT
);

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    city VARCHAR,
    scope VARCHAR,
    id_geo_area VARCHAR,
    active SMALLINT,
    valid_from BIGINT,
    valid_to BIGINT,
    created_at BIGINT,
    updated_at BIGINT
);

CREATE TABLE cost_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR,
    garrison VARCHAR,
    id_geo_area VARCHAR,
    active SMALLINT,
    valid_from BIGINT,
    valid_to BIGINT,
    created_at BIGINT,
    updated_at BIGINT
);

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    cost NUMERIC(19, 3),
    id_geo_area VARCHAR,
    active SMALLINT,
    valid_from BIGINT,
    valid_to BIGINT,
    created_at BIGINT,
    updated_at BIGINT
);

CREATE TABLE hours (
    id SERIAL PRIMARY KEY,
    user_id INT,
    project_id INT,
    time BIGINT,
    datetime BIGINT,
    description TEXT,
    active SMALLINT,
    valid_from BIGINT,
    valid_to BIGINT,
    created_at BIGINT,
    updated_at BIGINT
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    city_id INT,
    cost_center_id INT,
    cost_asset VARCHAR,
    typology VARCHAR,
    description TEXT,
    active SMALLINT,
    valid_from BIGINT,
    valid_to BIGINT,
    created_at BIGINT,
    updated_at BIGINT
);

CREATE TABLE responsibles (
    id SERIAL PRIMARY KEY,
    id_user INT,
    id_position INT,
    email VARCHAR,
    duration BIGINT,
    valid_from BIGINT,
    valid_to BIGINT,
    created_at BIGINT,
    updated_at BIGINT
);

CREATE OR REPLACE VIEW public.hours_view AS
    SELECT c.city,
        cc.name AS cost_center_name,
        u.full_name,
        p.description AS project_name,
        p.city_id,
        h.project_id,
        p.cost_center_id,
        p.cost_asset,
        h.datetime,
        p.description,
        h.user_id,
        h."time",
        h.id,
        h.active,
        h.valid_from,
        h.valid_to,
        h.created_at,
        h.updated_at
    FROM hours h
        JOIN projects p ON h.project_id = p.id
			JOIN cities c ON p.city_id = c.id
			JOIN cost_centers cc ON p.cost_center_id = cc.id
        JOIN users u ON h.user_id = u.id;

CREATE OR REPLACE VIEW public.projects_view AS
    SELECT c.city,
        cc.name AS cost_center_name,
        p.description AS project_name,
        p.city_id,
        p.cost_center_id,
        p.cost_asset,
        p.typology,
        p.id,
        p.active,
        p.valid_from,
        p.valid_to,
        p.created_at,
        p.updated_at
    FROM projects p
        JOIN cities c ON p.city_id = c.id
        JOIN cost_centers cc ON p.cost_center_id = cc.id;

CREATE OR REPLACE VIEW public.reports_full_view AS
    SELECT h.datetime AS hour_datetime,
        h.description AS hour_description,
        h."time" AS hour_time,
        p.description AS project_name,
        p.typology AS project_typology,
        p.cost_asset AS project_cost_asset,
        c.city AS city_name,
        c.scope AS city_scope,
        cc.description AS cost_center_description,
        cc.garrison AS cost_center_garrison,
        cc.name AS cost_center_name,
        u.name AS user_name,
        u.surname AS user_surname,
        u.full_name AS user_full_name,
        u.role AS user_role,
        u.email AS user_email,
        u.cost_center_sender AS user_city_center_sender,
        r.full_name AS responsible_full_name,
        po.name AS position_name,
        po.cost AS position_cost,
        u.id AS user_id,
        p.id AS project_id,
        cc.id AS cost_center_id,
        c.id AS city_id
        FROM hours h
            JOIN projects p ON h.project_id = p.id
            JOIN cities c ON p.city_id = c.id
            JOIN cost_centers cc ON p.cost_center_id = cc.id
            JOIN users u ON h.user_id = u.id
                JOIN users r ON u.id_responsible = r.id
            JOIN positions po ON u.id_position = po.id;

CREATE OR REPLACE VIEW public.users_view AS
    SELECT u.id,
        u.email,
        u.id_position,
        u.name,
        u.role,
        u.surname,
        u.cost_center_sender,
        u.full_name,
        u.active,
        u.valid_from,
        u.valid_to,
        u.created_at,
        u.updated_at,
        u.id_responsible,
        r.full_name AS responsible_full_name
    FROM users u
        JOIN users r ON u.id_responsible = r.id;
