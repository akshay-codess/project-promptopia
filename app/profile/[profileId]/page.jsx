import Profile from "@components/Profile"

// TODO: Implement the ProfilePage component
const ProfilePage = () => {

    // TODO: fetch name desc data later

    return (
        <Profile
            name={"My"}
            desc="Welcome to your personalized profile page"
            data={[]}
            handleEdit={() => { }}
            handleDelete={() => { }}
        />
    )
}

export default ProfilePage