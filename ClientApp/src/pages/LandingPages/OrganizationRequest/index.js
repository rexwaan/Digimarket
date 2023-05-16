
import MKBox from "components/MKBox";
import bgImage from "assets/images/child-g999c28865_1920.jpg";
// import Logo from '../../../examples/Logo'
import Logo from "../../../Navigation/Header"
import CreateOrgRequest from 'components/createOrgRequest';

function SignInBasic() {


  return (
    <>
    <Logo position = "fixed"/>
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={0}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
     <CreateOrgRequest status = {0}  />
    </>
  );
}

export default SignInBasic;
