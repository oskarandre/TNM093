function kmeans(data, k) {

    // Variables
    var iterations = 0;
    var maxLoops = 5;
    var iterations = 0;
    var qualityChange = 0;
    var oldqualitycheck = 0;
    var qualitycheck = 0;
    var converge = false;


    var new_array = parseData(data);

    var centroid = initCentroids(new_array, k);


    var clusterIndexPerPoint = new Array(new_array.length).fill(0);


    clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);

    do {

        centroid = computeClusterMeans(new_array, clusterIndexPerPoint, k);



        var clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);


        qualitycheck = qualityCheck(centroid, new_array, clusterIndexPerPoint);

 
        if (iterations == 0)
            oldqualitycheck = qualitycheck;

        if (iterations > 0)
            qualityChange = oldqualitycheck - qualitycheck;

        iterations++;

        if (qualityChange < 0.001 && qualityChange != 0) {
            converge = true;
        }
        if (iterations == maxLoops) {
            converge = true;
        }

        oldqualitycheck = qualitycheck;
    }
    while (converge == false)
    //Return results
    // console.log(clusterIndexPerPoint);
    // c = Math.round(centroid[0][1]);
    // console.log(c);

    // for (var d = 0; d < centroid.length; d++) {
    //     //Loop through all points
    //     for (var h = 0; h < new_array.length; h++) {
    //         //If this point belongs the current centroid
    //         if (clusterIndexPerPoint[h] == d) {
    //             console.log(d)
    //             // Calculate the sum of all points for each centroid
    //             // for (var f = 0; f < centroid[0].length; f++)
    //             //     qualitycheck = Math.pow(new_array[h][f] - centroid[d][f], 2);
    //         }
    //     }
    // }

    return {
        assignments: clusterIndexPerPoint
    };
}

/**
 *
 *  Parsing data to floats, use parseFloat
 * @param {*} data
 * return array
 */
function parseData(data) {

    var array = [];
    for (var i = 0; i < data.length; i++) {

        var parsed_data = [];
        for (var j in data[i])
            parsed_data.push(parseFloat(data[i][j]));

        array.push(parsed_data);
    }
    return array;
}

function initCentroids(data, k) {

    //Create k centroids
    var centroid = [];
    for (var j = 0; j < k; j++) {
        var rand = Math.floor((Math.random() * data.length) + 1);
        centroid.push(data[rand]);
    }

    return centroid;
}


function assignPointsToMeans(points, means) {

    var assignments = [];
    for (var i = 0, l = points.length; i < l; i++)
        assignments.push(findClosestMeanIndex(points[i], means));

    return assignments;
};


function findClosestMeanIndex(point, means) {

    var distances = [];
    for (var i = 0, l = means.length; i < l; i++)
        distances.push(euclideanDistance(point, means[i]));

    return findIndexOfMinimum(distances);
};


function euclideanDistance(point1, point2) {

    if (point1.length != point2.length)
        throw ("point1 and point2 must be of same dimension");

    var sum = 0;
    for (var i = 0; i < point1.length; i++)
        sum += (Math.pow((point1[i] - point2[i]), 2));

    return Math.sqrt(sum);
};


function findIndexOfMinimum(array) {

    var index = 0;
    var min = array[index];
    for (i = 1; i < array.length; i++) {
        if (array[i] < min) {
            index = i;
            min = array[i];
        }
    }

    return index;
};


function computeClusterMeans(points, assignments, k) {

    if (points.length != assignments.length)
        throw ("points and assignments arrays must be of same dimension");

    // for each cluster
    var newMeans = [];
    for (var i = 0; i < k; i++) {
        // save the array of points belonging to this cluster
        var pointsOfK = [];
        for (var j = 0; j < assignments.length; j++) {
            if (assignments[j] == i)
                pointsOfK.push(points[j]);
        }

        if (pointsOfK.length > 0)
            newMeans.push(averagePosition(pointsOfK))
    }

    return newMeans;
};


function averagePosition(points) {

    var sums = points[0];
    for (var i = 1; i < points.length; i++) {
        var point = points[i];
        for (var j = 0; j < point.length; j++) {
            sums[j] += point[j];
        }
    }

    for (var k = 0; k < sums.length; k++)
        sums[k] /= points.length;

    return sums;
};


function qualityCheck(centroid, new_array, clusterIndexPerPoint) {

    //Loop through all centroids
    for (var d = 0; d < centroid.length; d++) {
        //Loop through all points
        for (var h = 0; h < new_array.length; h++) {
            //If this point belongs the current centroid
            if (clusterIndexPerPoint[h] == d) {
                // Calculate the sum of all points for each centroid
                for (var f = 0; f < centroid[0].length; f++)
                    qualitycheck = Math.pow(new_array[h][f] - centroid[d][f], 2);
            }
        }
    }

    return qualitycheck;
}
