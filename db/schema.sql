create table Products (
  /* NOT NULL constraints could be changed depending on what we want */
  pcode INT PRIMARY KEY,  -- could also be alphanumeric
  price float(2), -- assuming two decimal digits
  sku INT NOT NULL, -- I'm not sure of the notation of sku, could be a different type
  amount_in_stock INT CHECK(amount_in_stock >= 0),
  pname VARCHAR(50) NOT NULL,
  desc TEXT NOT NULL,
  lang varchar(7) NOT NULL -- this is language code, like en_US
);

create table Users (
  uid VARCHAR(20) PRIMARY KEY,
  fname VARCHAR(20) NOT NULL,
  lname VARCHAR(20) NOT NULL,
  address VARCHAR(50) NOT NULL,
  phone INT(10) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(100) -- can be NULL if the user is not registered
);

create table Carts (
  uid VARCHAR(20) references Users(uid) PRIMARY KEY,
  pcode INT references Products(pcode) NOT NULL,
  amount_in_cart INT NOT NULL CHECK (amount_in_cart > 0) -- if not in cart, not in table
);

create table Orders (
  oid INT PRIMARY KEY,
  total_price float(2) NOT NULL,
  date TIMESTAMP NOT NULL, -- maybe TIMESTAMPTZ?
  destination VARCHAR(50) NOT NULL,
  uid VARCHAR(20) references Users(uid)
);

create table ProductsInOrder (
  oid INT references Orders(oid),
  pcode INT references Products(pcode),
  amount_in_order INT NOT NULL CHECK (amount_in_order > 0),
  PRIMARY KEY (oid, pcode)
);
