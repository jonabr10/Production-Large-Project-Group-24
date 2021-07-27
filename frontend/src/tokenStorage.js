exports.storeToken = function(token)
{
    try
    {
        localStorage.setItem('token_data', token.accessToken);
    }
    catch(e)
    {
        console.log(e.message);
    }
}

exports.retrieveToken = function()
{
    let tokenData;
    try
    {
        tokenData = localStorage.getItem('token_data');
    }
    catch(e)
    {
        console.log(e.message);
    }
    
    return tokenData;
}
