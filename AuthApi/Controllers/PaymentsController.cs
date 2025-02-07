using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Stripe;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public PaymentsController(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    [HttpPost("create-payment")]
    public async Task<IActionResult> CreatePaymentSession()
    {
        // TODO: Provide a real secret key, actually
        StripeConfiguration.ApiKey = _configuration["StripeSecretKey"];

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = 100, // Equivalent of $1
                        Currency = "usd",
                        ProductData =  new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Conversion Tokens",
                        },
                    },
                    Quantity = 1,
                },
            },
            Mode = "payment",
            SuccessUrl = "https://app.com/success?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = "https://app.com/cancel",
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return Ok(new { id = session.Id });
    }
}