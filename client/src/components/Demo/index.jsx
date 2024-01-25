import { Marketplace } from "./Marketplace";
import { Nftcollection } from "./NftCollection";

function Demo() {

  return (
    <div className="row">
        <div className="col-5">
          <Nftcollection/>
        </div>

      <div className="col-7">
        <Marketplace/>
      </div>
    </div>
  );
}

export default Demo;
