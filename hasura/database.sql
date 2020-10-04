CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR,
    id_position INT,
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
        JOIN users u ON h.user_id = u.id

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
        JOIN cost_centers cc ON p.cost_center_id = cc.id
