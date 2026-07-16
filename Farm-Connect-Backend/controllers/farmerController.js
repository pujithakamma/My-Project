let farmers = [
    {
        id: 201,
        farmerName: "Ramesh",
        email: "ramesh@gmail.com",
        phone: "9876543210",
        village: "Vijayawada",
        state: "Andhra Pradesh"
    },
    {
        id: 202,
        farmerName: "Suresh",
        email: "suresh@gmail.com",
        phone: "9123456780",
        village: "Guntur",
        state: "Andhra Pradesh"
    },
    {
        id: 203,
        farmerName: "Mahesh",
        email: "mahesh@gmail.com",
        phone: "9988776655",
        village: "Nellore",
        state: "Andhra Pradesh"
    }
];


export function getFarmers(req, res) {
    res.status(200).json(farmers);
}


export function getFarmerById(req, res) {
    const id = Number(req.params.id);
    const farmer = farmers.find(
        (farmer) => farmer.id === id
    );
    if (!farmer) {
        return res.status(404).json({
            success: false,
            message: "Farmer not found"
        });
    }
    res.status(200).json({
        success: true,
        farmer
    });
}


export function addFarmer(req, res) {
    const farmer = req.body;
    const existingFarmer = farmers.find(
        (f) => f.id === farmer.id
    );
    if (existingFarmer) {
        return res.status(400).json({
            success: false,
            message: "Farmer ID already exists"
        });
    }
    farmers.push(farmer);
    res.status(201).json({
        success: true,
        message: "Farmer added successfully",
        farmer
    });
}


export function updateFarmer(req, res) {
    const id = Number(req.params.id);
    const updatedFarmer = req.body;
    let farmerFound = false;
    farmers = farmers.map((farmer) => {
        if (farmer.id === id) {
            farmerFound = true;
            return { ...farmer, ...updatedFarmer };
        }
        return farmer;
    });
    if (!farmerFound) {
        return res.status(404).json({
            success: false,
            message: "Farmer not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Farmer updated successfully",
        farmer: updatedFarmer
    });

}

export function deleteFarmer(req, res) {
    const id = Number(req.params.id);
    const farmer = farmers.find(
        (farmer) => farmer.id === id
    );
    farmers = farmers.filter(
        (farmer) => farmer.id !== id
    );
    if (!farmer) {
        return res.status(404).json({
            success: false,
            message: "Farmer not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Farmer deleted successfully"
    });
}