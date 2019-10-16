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
  phone numeric(10) not null, -- 10 digits
  email varchar(50) not null,
  password varchar(100) -- can be null if the user is not registered
);

create table carts (
  cartid varchar(50) primary key,
  date_created timestamptz not null,
  date_modified timestamptz, -- could be null if not modified
  uid varchar(20) references users(uid) not null
);

create table products_in_cart (
  cartid varchar(50) references carts(cartid),
  pid int references products(pid),
  amount_in_cart int not null check (amount_in_cart > 0), -- not equal to 0, because otherwise not in cart
  date_added timestamptz not null,
  primary key (cartid, pid)
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
