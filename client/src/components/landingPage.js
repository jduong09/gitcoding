import React from 'react';
import logo from '../assets/watering-can.png';

const href = process && process.env && process.env.NODE_ENV === 'production'
  ? '/auth/login'
  : 'http://localhost:5000/auth/login';

const header = 'Keep Your Subscriptions Healthy';

const LandingPage = () => (
  <div>
    <header className="py-2 px-4 d-flex justify-content-between align-items-center border-bottom shadow-sm">
      <img src={logo} alt="watering can logo" width="60px" />
      <h1 className="h3 fw-normal">Water Your Subs</h1>
      <div />
    </header>
    <div className="container p-4 d-flex flex-column flex-lg-row justify-content-around align-items-center" style={{'minHeight': '85vh'}}>
      <div className="col-12 col-lg-6 order-1 order-lg-0">
        <div className="d-flex flex-column align-items-start">
          <h1 className="text-start display-3 fw-bold">
            {/* The CSS underlines each line and thus needs to be applied to each word as an individual element */}
            {header.split(' ').map((word) => <span key={word} className="text-underline-color">{word} </span>)}
          </h1>
          <p className="text-start py-3">Water Yours Subs keeps track of your subscriptions, providing you reminders to ensure you never have a late payment.</p>
          <a href={href} className="btn btn-primary rounded-pill px-4 fw-bold">Sign In</a>
        </div>
      </div>
      {/* FIXME: This is just a placeholder image for now */}
      <img className="col-12 col-lg-6 order-0 order-lg-1" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAmVBMVEX////vqMrg4eXzvto5NiXHyM0qJgvY2dw2MyJEQjQxMhyCYmn2rNAnLRHyqs3DjKMxLhouKxV7eXKVlI7P0NRnUVBMQTcwMRuDaW/GnK/6w+Dyutfs7O/wr8/zvNnxtNPz8/WnpqFaWE2wr6tBPi5YVUq5ubUfGgDOzcuFhH2meYnFl6tGPTElKw6VbnrkocDWmLQdFwCQj4h156QNAAAEJklEQVR4nO3aa1PaQByFcUQE1GDtRWgFZGttbbX29v0/XO1MHQnd6G72fzk7Pc+7GqaT3xA5BhgMGGOMMcYYY4wxxhhjjDHGmH/vLw/r6PJDL99qOj6dVtL4MPQQXp2O6un0Yz7w09j7rLO6/pwt/FLTUzgavXydLXz1IJwuZibdxXviQff/XkzLhbP5zQuT3sVrP+h268jt/b9vvi5KhXffmhOT9qOdr1sP2pw/Hln++UFzcjwrEy6Omz2L1nHgfvtRy60jm78/a86OioSz70DAiwhw7+THXYlwOjd5Cjdx30X7UduH1o8/boqu0qMzC2EHcJkE3GvmU3ThMg7ctB7Uuo5bR/CFF7nAnYsXXhj3ta7D9nW8A0QXdr2IdgOXu/8FtrD/DFYi7ADuXIdPA6GFZStRgVAGCCwsnEF8YTZwdyXQhXFfzkpgCwVmEFsoshLIQlEgolBoJXCFScB1MhBPKDWDsMLSu0F4YdzXayUghZIzCCmUuBuEFqa9Z5gLBBIKzyCeMH8l0oAwQvEZRBN2zGD7acqaQTBhEjBzJZCEKjOIJNSZQSBh2kr0BvoLtWYQRqg2gyhCvRkEESrOIIYw7hNaCQBh2kqUAh2FyjPoL1S6G8QRps3g9itR7ko4C/Vn0Fko/54hmDDuk51BV2ESsHgl/IRGM+gnlP3oDFCYNoPRb4rWIVS/G/QWGs6gj9ByBl2EcZ/SDDoIdd8zBBBaz6C50HwGrYX5N0tSQCOh3d2gk9BjBk2FYl+kRBXGfdozaCf0mkEzYdpKbAPFXkRthGbvGXoJHWfQRtgB3FHozKCJ0HUGLYTZH53lfzboK8z+BonsDKoL3WdQW5h/Nyj/Iqoq1P4GibvQ82bJRJi0ElZADSHGDCoKQWZQTxj32c+glhBnBpWEQDOoIwS4G9QVQs2ghhBrBhWE2R+d2QDlhHGf3wyKC5OAljMoLHT76MxKaPVFSjch5AxKCjFnUFAIOoNywvN4m2a79fahxrgi4Wj+tqPjVt1HDLoalQhHi46OWj1xSL9RmbCWKPw/hdfjmvr5K1s4nNTVMFu4GtbVikIK4aOQQvwopBA/CinEj0IK8aOQQvwopBA/Cv8teJ9yZiFbOPA+5czygZUR+wBr+lXM/yUsrs9vcbA/zYJ6PRPeJ51Tv+s7eJ92Rr2ANT2JfV+igveJJ9cTWM+T2H9lHF71+1Ty9573uadVAKyDWPaXUPA+/YSKgDU8iYVA/Beb8r/WgzfhmYqB6NepABCbKHNHCfyrKHXLHLwhXcm9eRW8KfEk353ztsQTBGISRYGIRGEgHFHjHXJvUyudjwCCN+uhELS+Ez4MwRt33+RAN/eLVRvoTgzqwIMDX+HKQBgo1M1A6As0eBKDs3AQJm80m3j7GGOMMcYYY4wxxhhjjDHGWHK/ARvZbNp3qP53AAAAAElFTkSuQmCC" alt="desktop" />
    </div>
  </div>
);

export default LandingPage;