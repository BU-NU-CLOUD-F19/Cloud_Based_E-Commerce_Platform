CREATE DATABASE cloud_ecommerce WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';
\connect cloud_ecommerce
create table products (
  pid serial primary key,
  pcode varchar(50),
  price float(2) check (price is null or price >= 0),
  sku varchar(50) not null,
  amount_in_stock int check(amount_in_stock >= 0),
  pname varchar(50) not null,
  description text not null,
  lang varchar(7) not null
);

create table users (
  uid varchar(20) primary key,
  fname varchar(50) not null,
  lname varchar(50) not null,
  address varchar(50) not null,
  phone varchar(10) not null, -- 10 digits
  email varchar(50) not null,
  date_created timestamptz not null,
  -- password varchar(100), -- can be null if the user is not registered
  constraint valid_phone check (phone ~* '^[0-9]{10}$')
);

create table carts (
  cart_id varchar(50) primary key,
  date_created timestamptz not null,
  date_modified timestamptz, -- could be null if not modified
  uid varchar(20) references users(uid) not null
);

create table products_in_cart (
  cart_id varchar(50) references carts(cart_id),
  pid int references products(pid),
  amount_in_cart int not null check (amount_in_cart > 0), -- not equal to 0, because otherwise not in cart
  date_added timestamptz not null,
  primary key (cart_id, pid)
);

create table orders (
  oid int primary key,
  total_price float(2) not null check (total_price >= 0),
  date timestamptz not null,
  destination varchar(50) not null,
  shipping float(2) not null check (shipping >= 0), -- shipping price
  uid varchar(20) references users(uid)
);

create table products_in_order (
  oid int references orders(oid),
  pid int references products(pid),
  amount_in_order int not null check (amount_in_order > 0),
  primary key (oid, pid)
);

create table stores (
  id varchar primary key,
  name varchar(200) not null,
  phone varchar(10) check(phone ~* '^[0-9]{10}$'),
  email varchar(50) not null,
  address varchar,
  date_created timestamptz
);

create table security_groups (
  id varchar primary key,
  scope varchar check(scope IN ('SUPER_ADMIN','STORE_ADMIN', 'CUSTOMER', 'GUEST'))
);

create table memberships (
  id varchar primary key,
  user_id varchar references users(uid),
  store_id varchar references stores(id),
  subscription_status boolean,
  date_created timestamptz
);

create table user_security_groups (
  id varchar primary key,
  user_id varchar references users(uid),
  store_id varchar references stores(id),
  security_group_id varchar references security_groups(id),
  date_created timestamptz
);