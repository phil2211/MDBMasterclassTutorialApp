select 
	addresses.`address.country`,
    sum(annualSpend) Total_spend,
    avg(annualSpend) Average_spend,
    max(annualSpend) Max_spend,
    count(*) customers
from customers 
left join (
	select * from customers_address
    where `address.location` = "work"
) addresses on (addresses._id = customers._id) 
group by addresses.`address.country`
order by Total_spend desc