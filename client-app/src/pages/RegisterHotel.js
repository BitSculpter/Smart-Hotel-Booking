import MainContainer from "../layout/MainContainer";
import Card1 from "../layout/Card";
import "../styles/text_styles.scss";
import "../styles/layout_styles.scss";
import React, { useState, useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import Facilities from "../components/RegisterHotelComponents/Facilities";
import ContactDetails from "../components/RegisterHotelComponents/ContactDetails";
import PropertyPhotos from "../components/RegisterHotelComponents/PropertyPhotos";
import HotelService from "./../services-domain/hotel-service copy";
import { FirebaseService } from "../services-common/firebase-service";
import { useNavigate } from "react-router-dom";
import ImagePreviewSection from "../components/RegisterHotelComponents/ImagePreviewSection";

function RegisterHotel() {
  const hotelService = HotelService.instance;
  const navigate = useNavigate();

  let user = "User";
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [registerButtonDisable, setRegisterButtonDisable] = useState(false);

  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [StarRate, setStarRate] = useState("");
  const [OwnerName, setOwnerName] = useState("");
  const [Email, setEmail] = useState("");
  const [AddressLine1, setaddressLine1] = useState("");
  const [AddressLine2, setaddressLine2] = useState("");
  const [City, setCity] = useState("");
  const [ContactNumber1, setContactNumber1] = useState("");
  const [ContactNumber2, setContactNumber2] = useState("");
  const [DistanceFromCenter, setDistanceFromCenter] = useState(0);

  const [HotelFacilities, setHotelFacilities] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [isCondition1Checked, setIsCondition1Checked] = useState(false);
  const [isCondition2Checked, setIsCondition2Checked] = useState(false);

  const toggleDropDown = () => {
    setDropDownOpen((prevState) => !prevState);
  };

  const onChangeUploadImages = (images) => {
    setUploadedImages((prevState) => [...prevState, ...images]);
  };

  // Form submit
  const submitForm = useCallback(async () => {
    setRegisterButtonDisable(true);

    try {
      // 1 - Upload Images
      let imageUrls = [];
      if (uploadedImages.length > 0)
        imageUrls = await FirebaseService.uploadFiles(Name, uploadedImages);

      // 2 - Generate a wallet Address
      const newWallet = await hotelService.createNewHotelWallet();
      console.log(newWallet);

      // 3 - Create request object
      const submissionData = {
        HotelWalletAddress: newWallet.address,
        Name: Name,
        Description: Description,
        OwnerName: OwnerName,
        Email: Email,
        AddressLine1: AddressLine1,
        AddressLine2: AddressLine2,
        City: City,
        ContactNumber1: ContactNumber1,
        ContactNumber2: ContactNumber2,
        DistanceFromCenter: DistanceFromCenter,
      };

      if (imageUrls.length > 0) submissionData.ImageUrls = imageUrls;

      if (HotelFacilities.length > 0)
        submissionData.Facilities = HotelFacilities;

      // 4 - Submit for registration
      const res = await hotelService.registerHotel(submissionData);

            if (res.hotelId > 0) {
                alert("Successful");
                navigate(`/hotel/${res.hotelId}`);
            } else {
                alert("Registration failed!");
            }
        } catch (err) {
            setRegisterButtonDisable(false);
            console.log(err);
            alert("Error occurred in Registration.!")
        }

    }, [Name, StarRate, Description, OwnerName, Email, AddressLine1, AddressLine2, City, ContactNumber1, ContactNumber2, DistanceFromCenter, HotelFacilities, uploadedImages]);


  return (
    <>
      <MainContainer>
        <section>
          <div className="title_1">Welcome {user}!</div>
          <Card1 width={"850px"}>
            <div className="title_3">Name of Your Property</div>
            <div className="subtext">
              Guests will see this name when they search for a place to stay.
            </div>
            <input
              type="text"
              className="form-control input_half"
              id="property_name"
              onChange={(e) => setName(e.target.value)}
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#908F8F",
                marginTop: "15px",
              }}
            />

            <div className="title_3 mt-3">Star Rating</div>
            <Dropdown isOpen={dropDownOpen} toggle={toggleDropDown} group>
              <button style={{ width: "100px" }}>{StarRate || "Select"}</button>
              <DropdownToggle
                caret
                style={{
                  textAlign: "right",
                  backgroundColor: "#ffffff",
                  borderColor: "#908F8F",
                }}
                className={"dropdown_1"}
                color={"black"}
              ></DropdownToggle>
              <DropdownMenu style={{ width: "50%" }}>
                <DropdownItem
                  className="dropdown_items"
                  onClick={(e) => setStarRate("1 Star")}
                >
                  1 Star
                </DropdownItem>
                <DropdownItem
                  className="dropdown_items"
                  onClick={(e) => setStarRate("2 Star")}
                >
                  2 Star
                </DropdownItem>
                <DropdownItem
                  className="dropdown_items"
                  onClick={(e) => setStarRate("3 Star")}
                >
                  3 Star
                </DropdownItem>
                <DropdownItem
                  className="dropdown_items"
                  onClick={(e) => setStarRate("4 Star")}
                >
                  4 Star
                </DropdownItem>
                <DropdownItem
                  className="dropdown_items"
                  onClick={(e) => setStarRate("5 Star")}
                >
                  5 Star
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <div className="title_3 mt-3">Description</div>
            <textarea
              className={"text_area"}
              name="postContent"
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Card1>
        </section>

        <ContactDetails
          setOwnerName={setOwnerName}
          setEmail={setEmail}
          setContactNumber1={setContactNumber1}
          setContactNumber2={setContactNumber2}
          setaddressLine1={setaddressLine1}
          setaddressLine2={setaddressLine2}
          setCity={setCity}
          setDistanceFromCenter={setDistanceFromCenter}
        />

        <Facilities setHotelFacilities={setHotelFacilities} />

        {/* <PropertyPhotos setImages={setImages} /> */}
        <PropertyPhotos onChangeUploadImages={onChangeUploadImages} />
        {uploadedImages.length !== 0 && (
          <ImagePreviewSection images={uploadedImages} />
        )}

        <section>
          <div className={"title_3"} style={{ lineHeight: "25px" }}>
            You’re almost done.
            <br />
            To complete your registration, check the boxes below:
          </div>

          <div className={"pt-3"} style={{ marginLeft: "20px" }}>
            <FormGroup check inline>
              <Input
                type="checkbox"
                style={{ width: 25, height: 25 }}
                onChange={(e) => setIsCondition1Checked(e.target.checked)}
              />
              &nbsp;&nbsp;&nbsp;
              <Label check style={{ lineHeight: "20px" }}>
                <div className={"title_4"}>
                  I certify that this is a legitimate accommodation business
                  with all necessary licenses and permits, which can be shown
                  upon first request.
                  <br /> VoyageLanka reserves the right to verify and
                  investigate any details provided in this registration.
                </div>
              </Label>
            </FormGroup>
          </div>

          <div className={"pt-3"} style={{ marginLeft: "20px" }}>
            <FormGroup check inline>
              <Input
                type="checkbox"
                style={{ width: 25, height: 25 }}
                onChange={(e) => setIsCondition2Checked(e.target.checked)}
              />
              &nbsp;&nbsp;&nbsp;
              <Label check>
                <div className={"title_4"}>
                  I have read, accepted, and agreed to the Terms & Policies.
                </div>
              </Label>
            </FormGroup>
          </div>
        </section>

        <div className={"row center_div pt-3"}>
          <button
            className={"complete_registration_button"}
            style={{ width: "650px" }}
            disabled={
              registerButtonDisable ||
              !(isCondition1Checked && isCondition2Checked)
            }
            onClick={submitForm}
          >
            Complete registration
          </button>
        </div>
      </MainContainer>
    </>
  );
}

export default RegisterHotel;