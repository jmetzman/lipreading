/*
Not necessary but don't know how to do:
-Restrict scope of variables to just this file?
-Pass those matrices by reference instead of by value to speed it up?
-.....are they passed by value or reference in the first place?
*/

/*
A: Matrix representing path of a word; array of frames, where frames are array of points
B: Matrix representing path of a query
memo: DP table of dimensions [A.length+1][B.length+1]
i: how many frames are left in A
j: how many frames are left in B
*/
var INF = 100000;
var memo;
var MAX_SIZE_SCALE = .9;

function calcSimilarity(word, query)
{
	//initialize DP table with zeros. Matrix of size [word.length+1][query.length+1]
	memo = [];
	for(var i = 0; i <= word.length; i++)
	{
		memo.push([]);
		for(var j = 0; j <= query.length; j++)
			memo[i].push(0);
	}

	//check if word is of appropriate length
	if(query.length <= MAX_SIZE_SCALE * word.length)
		return dp(word, query, word.length, query.length);
	else //query is too long, must sample it
	{
		console.log("Query too long");
		var sampled = [];
		var sampleRate = Math.floor(query.length / Math.abs(word.length - query.length));

		for(var i = 0; i < query.length; i++)
		{
			//remove/exclude periodic frames
			if(i % sampleRate != 0)
				sampled.push(query[i]);
		}

		return dp(word, sampled, word.length, sampled.length);
	}
}

//helper function, performs DP calculations
function dp(A, B, i, j)
{
	if(j == 0) //finished comparing all of B
		return 0;
	else if(i < j) //not enough of A to compare with B, don't continue
		return INF;
	else if(memo[i][j] != 0)
		return memo[i][j];

	var cost = calcDist(A[i-1], B[j-1]);
	memo[i][j] = Math.min(dp(A, B, i-1, j-1) + cost, dp(A, B, i-1, j));

	return memo[i][j];
}

//find sum of squared differences in x and y coordinates of points in 2 frames
function calcDist(frame1, frame2)
{
	var sum = 0;
	for(var k = 0; k < frame1.length; k++) { //kth point in both frames
		sum += Math.pow(frame1[k][0] - frame2[k][0], 2) + 
			   Math.pow(frame1[k][1] - frame2[k][1], 2);
	}
	return sum;
}

//converts an array of nums into proper format for DP. Debug only
function convertDebugFrame(arr)
{
	var converted = [];
	for(var i = 0; i < arr.length; i++)
	{
		converted[i] = [[arr[i], 0]];
	}
	return converted;
}

//debug version for only a 1D array
function getScore(A, B, i, j)
{
	if(j == 0) // finished comparing all of arr2
		return 0;
	else if(i < j) //more arr2 elements left than arr1, can't finish comparing
		return INF;
	else if(memo[i][j] != 0)
		return memo[i][j];
	
	var cost = Math.pow(A[i-1] - B[j-1], 2);

	var a1 = getScore(A, B, i-1, j-1) + cost;
	var a2 = getScore(A, B, i-1, j);
	memo[i][j] = Math.min(a1, a2);

	return memo[i][j];
}
