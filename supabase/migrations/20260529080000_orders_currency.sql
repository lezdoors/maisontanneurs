-- Multi-currency: persist the ISO 4217 currency every order was charged in.
-- Prior orders are USD by default.
alter table orders add column if not exists currency text not null default 'USD';
