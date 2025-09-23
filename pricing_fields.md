# SkyBox MRO Pricing Fields

Based on the meeting transcription, here are the key fields used to determine pricing in the SkyBox MRO system:

## Primary Pricing Variables

### Core Cost Components

- **Raw Material Cost** - Board/material costs
- **Setup Cost** - Machine setup time costs
- **Run Speed Variables** - Machine run rates and efficiency
- **Machine Routing** - Which machine (like the 144 machine) is optimal

### Product Specifications

- **Box Dimensions** - Length, width, depth
- **Style** - Box style/type
- **Board Grade** - Material quality/grade
- **Glue Joint** - Joint specifications
- **Number of Colors** - Printing complexity
- **Order Quantity** - Volume affects pricing

### Pricing Calculation Fields

- **Sell Price** - Final quoted price
- **Margin** - Profit margin above raw material cost
- **Setup Time** - Hours required for machine setup
- **Run Speeds** - Machine efficiency rates
- **Machine Parameters** - Machine-specific variables

### Business Context Variables

- **Customer Situation** - Account history and relationship
- **Competitor Analysis** - Competitive landscape
- **Order Size** - Volume discounts
- **Historical Margin Patterns** - Past pricing success
- **Account Age** - Length of customer relationship
- **Annual Usage** - Customer volume patterns

### Decision Factors

- **Competitive vs Non-Competitive Quotes**
- **Probability of Closing** - Success likelihood
- **Request Value** - Customer's budget expectations
- **Sales Person Assessment** - Sales team input

## Key Pricing Process

The system uses these variables in an offline Excel calculator to determine final pricing, with the key decision being what number to put in the "sell price" field based on all these factors.

### Current Workflow

1. Design lab creates MRO drawings (PDFs)
2. Estimating team manually translates PDFs into Amtech specs
3. Pricing is done through an offline Excel calculator
4. Most specs created are "RFQ specs" that don't turn into actual orders

### Proposed AI Solution

- Automate PDF to spec translation
- Extract key variables from PDFs automatically
- Use historical data to make pricing recommendations
- Learn from patterns in successful vs unsuccessful quotes

## Machine-Specific Variables

- **Machine Matrix** - Run speeds and setup times for different box sizes
- **Machine Limits** - Min/max dimensions for length and width
- **Board Cost Settings** - Material costs for estimating
- **Standard Constants** - Machine variables and run speed matrices
- **Efficiency Penalties** - Machine efficiency factors
- **Test and Flute** - Additional material specifications

## Historical Data Requirements

- Quote history with associated invoices
- Profit/loss data by quote
- Success/failure rates
- Customer relationship data
- Competitive analysis data
- Sales team notes and context
